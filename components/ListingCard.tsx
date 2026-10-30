// components/ListingCard.tsx

import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/types';

interface ListingCardProps {
  listing: Listing;
  priority?: boolean;
}

export function ListingCard({ listing, priority }: ListingCardProps) {
  const price = (listing.price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: listing.currency,
    maximumFractionDigits: 0,
  });

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={listing.image_url}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={priority ? 'eager' : 'lazy'}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-medium text-white">
          {listing.type === 'digital' ? 'Digital' : 'Project'}
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900 dark:text-gray-100">
          {listing.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {listing.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {listing.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {price}
          </span>
          <span className="text-xs text-gray-400">by {listing.seller_name}</span>
        </div>
      </div>
    </Link>
  );
}