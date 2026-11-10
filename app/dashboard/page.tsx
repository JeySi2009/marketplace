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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Мои проекты</h1>
        <Link href="/sell" className="w-fit rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover whitespace-nowrap">
          + Новый проект
        </Link>
      </div>

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
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Название</th>
                <th className="px-6 py-3 font-medium">Цена</th>
                <th className="px-6 py-3 font-medium">Статус</th>
                <th className="px-6 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
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
                    <div className="flex items-center justify-end gap-3">
                      {/* Кнопка просмотра (ведет на публичную страницу) */}
                      <Link
                        href={`/listing/${item.slug}`}
                        className="text-gray-400 hover:text-accent transition-colors"
                        title="Предпросмотр"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>

                      {/* Кнопка редактирования */}
                      <Link
                        href={`/dashboard/edit/${item.id}`}
                        className="text-gray-400 hover:text-accent transition-colors"
                        title="Редактировать"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                    </div>
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