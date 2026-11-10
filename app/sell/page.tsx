// app/sell/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { ListingType } from '@/types';
import Link from 'next/link';

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null); // временно any для простоты
  const [imageFile, setImageFile] = useState<File | null>(null); // Стейт для файла

  // Проверяем, залогинен ли пользователь при загрузке
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    let imageUrl = '/images/placeholder.svg'; // Заглушка по умолчанию

    // Если пользователь выбрал картинку — загружаем её в Supabase Storage
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('listing-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        alert('Ошибка загрузки картинки: ' + uploadError.message);
        setLoading(false);
        return;
      }

      // Получаем публичный URL загруженной картинки
      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    // Сохраняем листинг в БД с картинкой
    const { error } = await supabase.from('listings').insert({
      slug,
      title,
      description: formData.get('description'),
      price: Math.round(Number(formData.get('price')) * 100),
      type: formData.get('type'),
      tags: (formData.get('tags') as string).split(',').map((t) => t.trim()).filter(Boolean),
      seller_id: user.id,
      seller_name: user.email,
      image_url: imageUrl, // <-- Передаем ссылку на картинку
      status: 'active',
    });

    setLoading(false);

    if (error) {
      alert('Ошибка при создании: ' + error.message);
      return;
    }

    router.push(`/listing/${slug}`);
    router.refresh();
  };

  if (!user) {
    return <div className="text-center py-20">Загрузка...</div>;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10"> {/* max-w-2xl ограничивает ширину */}

      {/* Кнопка Назад */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-accent dark:text-gray-400 transition-colors"
      >
        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Вернуться в кабинет
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Разместить проект</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">Заполните форму, чтобы выставить товар на продажу.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Название</label>
          <input required name="title" type="text" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none focus:border-transparent dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Описание</label>
          <textarea required name="description" rows={4} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none focus:border-transparent dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Цена (USD)</label>
            <input required name="price" type="number" min="0" step="0.01" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none focus:border-transparent dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Тип</label>
            <select name="type" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none focus:border-transparent dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value="digital">Цифровой товар</option>
              <option value="project">Готовый проект</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Теги (через запятую)</label>
          <input name="tags" type="text" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none focus:border-transparent dark:border-gray-700 dark:bg-gray-900 dark:text-white" placeholder="Next.js, React" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Обложка проекта</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 file:mr-4 file:rounded-md file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-accent/20"
          />
        </div>

        <button disabled={loading} type="submit" className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50">
          {loading ? 'Публикуем...' : 'Опубликовать'}
        </button>
      </form>
    </main>
  );
}