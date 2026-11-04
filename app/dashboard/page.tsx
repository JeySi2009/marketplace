// app/dashboard/page.tsx
import Link from 'next/link';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import { redirect } from 'next/navigation';
import type { Listing } from '@/types';
import { connection } from 'next/server';

// Выносим всю динамическую логику в отдельный компонент
async function DashboardContent() {
  await connection(); // Теперь это внутри Suspense

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="w-full"> {/* Обертка на всю ширину */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Мои проекты</h1>
      <Link href="/sell" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover">
        + Новый проект
      </Link>

      {/* Пустое состояние или Таблица */}
      {!listings || listings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400">У вас пока нет проектов.</p>
          <Link href="/sell" className="mt-4 inline-block text-accent hover:underline">
            Создать первый проект
          </Link>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            {/* ... заголовки таблицы ... */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {listings.map((item: Listing) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    <Link href={`/listing/${item.slug}`} className="hover:text-accent">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    ${(item.price / 100).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                      {item.status === 'active' ? 'Активен' : 'Черновик'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-red-500 hover:text-red-700 text-sm font-medium">Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Основная страница теперь синхронная и оборачивает контент в Suspense
export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Header />
      <Suspense fallback={
        <div className="flex flex-col gap-4">
          <div className="h-10 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </main>
  );
}