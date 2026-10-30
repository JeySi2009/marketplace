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
  type: 'digital' | 'project';
  price: number;
  currency: string;
  tags: string[];
  image_url: string;       // было imageUrl
  seller_id: string;       // было sellerId
  seller_name: string;     // было sellerName
  status: 'draft' | 'pending' | 'active' | 'sold';
  created_at: string;      // было createdAt
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