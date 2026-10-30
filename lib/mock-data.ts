// lib/mock-data.ts

import type { Listing } from '@/types';

export const mockListings: Listing[] = [
  {
    id: '1',
    slug: 'saas-analytics-dashboard',
    title: 'SaaS Analytics Dashboard',
    description:
      'Готовый дашборд на Next.js + Tailwind: графики, таблицы, тёмная тема. Код чистый, есть документация.',
    type: 'digital',
    price: 4900,
    currency: 'USD',
    tags: ['Next.js', 'Tailwind', 'Dashboard'],
    imageUrl: '/images/placeholder.svg',
    sellerId: 'u1',
    sellerName: 'alex.dev',
    status: 'active',
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: '2',
    slug: 'crypto-portfolio-tracker',
    title: 'Crypto Portfolio Tracker',
    description:
      'Рабочий проект целиком: фронт на React, бэк на Node, интеграция с CoinGecko API. 200+ активных юзеров.',
    type: 'project',
    price: 250000,
    currency: 'USD',
    tags: ['React', 'Node.js', 'Fintech'],
    imageUrl: '/images/placeholder.svg',
    sellerId: 'u2',
    sellerName: 'mike_builds',
    status: 'active',
    createdAt: '2026-09-25T14:30:00Z',
  },
  {
    id: '3',
    slug: 'notion-style-editor',
    title: 'Notion-style Block Editor',
    description:
      'Компонент блочного редактора с drag-and-drop. TypeScript, без зависимостей. Идеально для стартапа.',
    type: 'digital',
    price: 2900,
    currency: 'USD',
    tags: ['TypeScript', 'Editor', 'React'],
    imageUrl: '/images/placeholder.svg',
    sellerId: 'u1',
    sellerName: 'alex.dev',
    status: 'active',
    createdAt: '2026-10-10T09:15:00Z',
  },
  {
    id: '4',
    slug: 'marketplace-boilerplate',
    title: 'Marketplace Boilerplate',
    description:
      'Каркас маркетплейса: листинги, корзина, Stripe Connect. Всё, чтобы запустить свой маркетплейс за неделю.',
    type: 'project',
    price: 150000,
    currency: 'USD',
    tags: ['Stripe', 'Next.js', 'Marketplace'],
    imageUrl: '/images/placeholder.svg',
    sellerId: 'u3',
    sellerName: 'vibe_studio',
    status: 'active',
    createdAt: '2026-10-15T16:45:00Z',
  },
];