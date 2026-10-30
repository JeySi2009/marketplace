// app/listing/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import type { Listing } from '@/types';

// Внутренний компонент принимает промис params и разворачивает его здесь
async function ListingDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !listing) {
    notFound();
  }

  const item = listing as Listing;
  const price = (item.price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: item.currency,
    maximumFractionDigits: 0,
  });

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="eager"
          className="object-cover"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {item.title}
        </h1>
        <p className="mt-2 text-sm text-gray-400">by {item.seller_name}</p>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          {item.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 p-5 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Цена
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {price}
            </span>
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Купить
          </button>
        </div>
      </div>
    </div>
  );
}

// Основной компонент НЕ разворачивает params — просто передаёт промис дальше
export default function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        ← Назад к листингам
      </Link>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="aspect-[3/2] w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-4 pt-2">
              <div className="h-9 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-24 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        }
      >
        <ListingDetails params={params} />
      </Suspense>
    </main>
  );
}