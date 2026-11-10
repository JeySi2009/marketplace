// app/catalog/page.tsx
import Link from 'next/link';
import { Suspense } from 'react';
import { ListingCard } from '@/components/ListingCard';
import { supabase } from '@/lib/supabase';
import type { Listing } from '@/types';
import { Header } from '@/components/Header';

// --- Боковая панель с фильтрами ---
function Sidebar({ activeCategory }: { activeCategory?: string }) {
  const categories = ['SaaS', 'Шаблоны', 'Боты', 'Next.js', 'React', 'Mobile'];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-6 space-y-8">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Категории</h3>
          <div className="space-y-2">
            <Link href="/catalog" className={`block px-3 py-2 rounded-lg text-sm ${!activeCategory ? 'bg-accent/10 text-accent font-medium' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
              Все проекты
            </Link>
            {categories.map((cat) => (
              <Link key={cat} href={`/catalog?category=${cat}`} className={`block px-3 py-2 rounded-lg text-sm ${activeCategory === cat ? 'bg-accent/10 text-accent font-medium' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

// --- Сетка листингов ---
async function ListingsGrid({ category }: { category?: string }) {
  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (category) query = query.contains('tags', [category]);

  const { data: listings, error } = await query;

  if (error || !listings || listings.length === 0) {
    return <div className="text-gray-500 py-10">Ничего не найдено по этому фильтру.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {(listings as Listing[]).map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

// --- Основная страница каталога ---
export default function CatalogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <Header />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Каталог проектов</h1>
        <p className="mt-2 text-gray-500">Ищите готовые решения, шаблоны и SaaS-проекты.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <Suspense fallback={<div className="w-64 h-40 animate-pulse bg-gray-200 rounded-lg"></div>}>
          <SidebarWrapper searchParams={searchParams} />
        </Suspense>

        <div className="flex-1">
          <Suspense fallback={<div className="text-gray-500">Загрузка проектов...</div>}>
            <ListingsWrapper searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

// Обертки для чтения searchParams (чтобы избежать ошибки Blocking Route)
async function SidebarWrapper({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return <Sidebar activeCategory={category} />;
}

async function ListingsWrapper({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return <ListingsGrid category={category} />;
}