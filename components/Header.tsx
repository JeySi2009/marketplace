// components/Header.tsx
import { connection } from 'next/server';
import Link from 'next/link';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from './LogoutButton';

// Выносим динамическую часть в отдельный асинхронный компонент
async function UserNav() {
  await connection();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return (
      <>
        <span className="text-sm text-gray-500 hidden sm:inline">{user.email}</span>
        <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-accent dark:text-gray-300">
          Мои проекты
        </Link>
        <LogoutButton />
      </>
    );
  }

  return (
    <>
      <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
        Войти
      </Link>
      <Link href="/register" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
        Регистрация
      </Link>
    </>
  );
}

// Основной компонент шапки (остается синхронным)
export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between border-b pb-4 dark:border-gray-800">
      <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Vibe Market
      </Link>

      <div className="flex items-center gap-4">
        {/* Оборачиваем динамическую часть в Suspense */}
        <Suspense fallback={
          <div className="flex items-center gap-4">
            {/* Плейсхолдеры, чтобы не было скачка верстки */}
            <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        }>
          <UserNav />
        </Suspense>
      </div>
    </header>
  );
}