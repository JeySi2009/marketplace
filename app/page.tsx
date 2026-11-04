// app/page.tsx
import Link from 'next/link';
import { Suspense } from 'react';
import { ListingCard } from '@/components/ListingCard';
import { supabase } from '@/lib/supabase';
import type { Listing } from '@/types';
import { Header } from '@/components/Header';

// Компонент, который непосредственно делает запрос
async function ListingsGrid() {
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
    return <p className="text-red-500">Не удалось загрузить листинги. Попробуйте позже.</p>;
  }

  if (!listings || listings.length === 0) {
    return <p className="text-gray-500">Пока нет листингов. Станьте первым!</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {(listings as Listing[]).map((listing, i) => (
        <ListingCard key={listing.id} listing={listing} priority={i < 3} />
      ))}
    </div>
  );
}

// Основной компонент страницы
export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Header />

      {/* Оборачиваем динамический контент в Suspense */}
      <Suspense fallback={
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Простой скелетон, чтобы не было скачка верстки */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      }>
        <ListingsGrid />
      </Suspense>
    </main>
  );
}