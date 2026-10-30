// app/page.tsx

import { ListingCard } from '@/components/ListingCard';
import { mockListings } from '@/lib/mock-data';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Vibe Market
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Цифровые товары и готовые проекты на продажу
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </section>
    </main>
  );
}