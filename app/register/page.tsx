'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    
    if (error) {
      setError(error.message)
    } else {
      alert('Проверьте почту для подтверждения (если включено в Supabase) или войдите.')
      router.push('/login')
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Регистрация</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-lg border p-2 bg-transparent text-foreground" />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-lg border p-2 bg-transparent text-foreground" />
        <button type="submit" className="w-full rounded-lg bg-accent px-4 py-2 text-white hover:bg-accent-hover">Создать аккаунт</button>
      </form>
      <p className="mt-4 text-sm text-center">Уже есть аккаунт? <Link href="/login" className="text-accent hover:underline">Войти</Link></p>
    </main>
  )
}