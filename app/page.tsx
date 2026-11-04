// app/page.tsx
import { Spotlight } from '@/components/Spotlight';
import Link from 'next/link';
import { Suspense } from 'react';
import { ListingCard } from '@/components/ListingCard';
import { supabase } from '@/lib/supabase';
import type { Listing } from '@/types';
import { Header } from '@/components/Header';

// 1. Hero-секция (Баннер)
function Hero() {
  return (
    <Spotlight 
      magnetic={true} 
      // Вернули жесткий черный фон: bg-[#0a0a0a] для светлой темы, dark:bg-[#0a0a0a] для темной.
      className="rounded-3xl mb-12 border border-gray-200 dark:border-gray-800/50 bg-[#0a0a0a] dark:bg-[#0a0a0a]"
    >
      {/* Добавили text-white, чтобы текст не зависел от глобальной темы */}
      <section className="px-6 py-20 sm:px-12 sm:py-28 relative z-10 text-white">
        <div className="mx-auto max-w-3xl text-center">
          
          <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent mb-6 border border-accent/30">
            Платформа для продажи цифровых проектов
          </span>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Покупай и продавай <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">
              готовый код
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
            Vibe Market — это место, где разработчики находят готовые SaaS-проекты и компоненты, а авторы получают вознаграждение.
          </p>
          
          <div className="mt-10">
            <Link href="/catalog" className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white hover:bg-accent-hover transition-colors">
              Перейти в каталог
            </Link>
          </div>
          
        </div>
      </section>
    </Spotlight>
  );
}

// 2. Секция "Как это работает"
function HowItWorks() {
  return (
    <section className="my-16 rounded-3xl bg-gray-50 p-8 dark:bg-gray-900 sm:p-12">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">Как это работает</h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-accent/10 p-4 text-accent">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Выбираете проект</h3>
          <p className="mt-2 text-sm text-gray-500">Изучаете стек, документацию и историю продавца.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-accent/10 p-4 text-accent">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Безопасная сделка</h3>
          <p className="mt-2 text-sm text-gray-500">Средства замораживаются до передачи прав и кода.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-accent/10 p-4 text-accent">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Получаете доступ</h3>
          <p className="mt-2 text-sm text-gray-500">Репозиторий переходит вам, сделка закрывается.</p>
        </div>
      </div>
    </section>
  );
}

// 3. Секция "Рекомендуемые проекты" (Берем только 3 штуки)
async function TopListings() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3); // Ограничиваем тремя!

  if (!listings || listings.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Рекомендуемые проекты</h2>
        <Link href="/catalog" className="text-sm font-medium text-accent hover:underline">
          Все проекты →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(listings as Listing[]).map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}

// --- Сборка главной страницы ---
export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <Header />
      
      <Hero />
      
      <HowItWorks />
      
      <Suspense fallback={
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      }>
        <TopListings />
      </Suspense>
    </main>
  );
}