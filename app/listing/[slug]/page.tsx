// app/listing/[slug]/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockListings } from '@/lib/mock-data';

export const instant = false;

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = mockListings.find((l) => l.slug === slug);

  if (!listing) {
    notFound();
  }

  const price = (listing.price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: listing.currency,
    maximumFractionDigits: 0,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        ← Назад к листингам
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="eager"
            className="object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-medium text-white">
            {listing.type === 'digital' ? 'Digital' : 'Project'}
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {listing.title}
          </h1>
          <p className="mt-2 text-sm text-gray-400">by {listing.sellerName}</p>

          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {listing.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {listing.tags.map((tag) => (
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
    </main>
  );
}