'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase' // используем клиентский клиент для входа
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError(error.message)
    } else {
      router.push('/')
      router.refresh() // Обновляем серверные компоненты
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Вход</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-lg border p-2 bg-transparent text-foreground" />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-lg border p-2 bg-transparent text-foreground" />
        <button type="submit" className="w-full rounded-lg bg-accent px-4 py-2 text-white hover:bg-accent-hover">Войти</button>
      </form>
      <p className="mt-4 text-sm text-center">Нет аккаунта? <Link href="/register" className="text-accent hover:underline">Зарегистрироваться</Link></p>
    </main>
  )
}