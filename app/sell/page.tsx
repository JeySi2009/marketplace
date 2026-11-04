// app/sell/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null); // временно any для простоты

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

    const { error } = await supabase.from('listings').insert({
      slug,
      title,
      description: formData.get('description'),
      price: Math.round(Number(formData.get('price')) * 100),
      type: formData.get('type'),
      tags: (formData.get('tags') as string).split(',').map((t) => t.trim()).filter(Boolean),
      seller_id: user.id,
      seller_name: user.email,
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
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Разместить проект</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">Заполните форму, чтобы выставить товар на продажу.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Название</label>
          <input required name="title" type="text" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Описание</label>
          <textarea required name="description" rows={4} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Цена (USD)</label>
            <input required name="price" type="number" min="0" step="0.01" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Тип</label>
            <select name="type" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value="digital">Цифровой товар</option>
              <option value="project">Готовый проект</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Теги (через запятую)</label>
          <input name="tags" type="text" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" placeholder="Next.js, React" />
        </div>
        <button disabled={loading} type="submit" className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50">
          {loading ? 'Публикуем...' : 'Опубликовать'}
        </button>
      </form>
    </main>
  );
}