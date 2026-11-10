// app/listing/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { createClient } from '@/lib/supabase/server';
import type { Listing } from '@/types';
import { connection } from 'next/server';

// --- Динамический контент (внутри Suspense) ---
async function ListingDetails({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Говорим Next.js, что этот компонент рендерится только на запросе
  await connection(); 

  const { slug } = await params;

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !listing) notFound();

  // 2. Проверяем пользователя (тоже внутри Suspense)
  const serverSupabase = await createClient();
  const { data: { user } } = await serverSupabase.auth.getUser();

  const item = listing as Listing;
  const isOwner = user?.id === item.seller_id;

  // 3. Вычисляем, куда вести кнопку "Назад"
  const backLink = isOwner ? "/dashboard" : "/catalog";
  const backText = isOwner ? "Вернуться в кабинет" : "Вернуться в каталог";

  const price = (item.price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: item.currency,
    maximumFractionDigits: 0,
  });
  const sellerInitial = item.seller_name ? item.seller_name.charAt(0).toUpperCase() : '?';

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Кнопка "Назад" теперь внутри динамического компонента, поэтому знает про isOwner */}
      <Link 
        href={backLink} 
        className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-accent dark:text-gray-400 transition-colors"
      >
        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {backText}
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_400px]">
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="space-y-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 dark:border-gray-800 dark:bg-gray-800">
            <Image src={item.image_url} alt={item.title} fill sizes="(max-width: 768px) 100vw, 60vw" loading="eager" className="object-cover" />
            
            {isOwner && (
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${
                  item.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                }`}>
                  {item.status === 'active' ? 'Активен' : 'Черновик'}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 p-6 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Стоимость</span>
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{price}</span>
            </div>
            
            <div className="space-y-3">
              {isOwner ? (
                <Link
                  href={`/dashboard/edit/${item.id}`}
                  className="block w-full text-center rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  Редактировать проект
                </Link>
              ) : (
                <button
                  type="button"
                  className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  Купить сейчас
                </button>
              )}
              
              {!isOwner && (
                <a
                  href={`mailto:${item.seller_name}?subject=Вопрос по проекту: ${item.title}`}
                  className="block w-full text-center rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Связаться с продавцом
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
              {sellerInitial}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Продавец</p>
              <p className="text-sm text-gray-500">{item.seller_name}</p>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {item.type === 'digital' ? 'Цифровой товар' : 'Готовый проект'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            {item.title}
          </h1>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Описание</h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Что входит в проект</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Полный исходный код (репозиторий)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Документация по установке и настройке</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Права на коммерческое использование</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Синхронная обертка (без connection и запросов) ---
export default function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-4 py-10">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800 mb-8" />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-4">
              <div className="h-8 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-12 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-24 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </main>
      }
    >
      {/* Передаем params как промис, не разворачивая его */}
      <ListingDetails params={params} />
    </Suspense>
  );
}