// components/LogoutButton.tsx
'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh(); // Обновляем серверные компоненты, чтобы шапка перерисовалась
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
    >
      Выйти
    </button>
  );
}