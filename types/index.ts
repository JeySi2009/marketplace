// types/index.ts

export type ListingType = 'digital' | 'project';

export type ListingStatus = 'draft' | 'pending' | 'active' | 'sold';

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: string;
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: ListingType;
  price: number;        // в центах, чтобы не мучиться с float
  currency: string;     // пока 'USD'
  tags: string[];
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  status: ListingStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}