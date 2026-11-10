'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Стейт для картинки
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'digital',
    tags: '',
    status: 'active'
  });

  useEffect(() => {
    const unwrapParams = async () => {
      const { id } = await params;
      setId(id);

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Ошибка загрузки листинга:', error);
        setErrorMsg('Не удалось загрузить проект.');
      }

      if (data) {
        setFormData({
          title: data.title,
          description: data.description,
          price: (data.price / 100).toString(),
          type: data.type,
          tags: data.tags.join(', '),
          status: data.status
        });
        setCurrentImage(data.image_url);
      }
      setLoading(false);
    };
    unwrapParams();
  }, [params]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    let imageUrl = currentImage; // Оставляем текущую картинку по умолчанию

    // Если пользователь выбрал новую картинку
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        setErrorMsg('Ошибка загрузки картинки: ' + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);

      imageUrl = `${publicUrl}?v=${Date.now()}`;
    }

    // Обновляем данные в БД
    const { data: updatedData, error } = await supabase.from('listings')
      .update({
        title: formData.title,
        description: formData.description,
        price: Math.round(Number(formData.price) * 100),
        type: formData.type,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        status: formData.status,
        image_url: imageUrl,
      })
      .eq('id', id)
      .select();

    setSaving(false);

    if (error) {
      setErrorMsg('Ошибка сохранения: ' + error.message);
    } else if (!updatedData || updatedData.length === 0) {
      // Если RLS заблокировал, data будет пустым массивом
      setErrorMsg('Не удалось обновить проект. Возможно, нет прав (RLS).');
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  if (loading) return <div className="p-10 text-center">Загрузка...</div>;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/dashboard" className="mb-6 inline-flex text-sm text-gray-500 hover:text-accent">← Назад в кабинет</Link>
      <h1 className="text-3xl font-bold mb-8">Редактировать проект</h1>

      {errorMsg && (
        <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-500 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Название</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full rounded-xl border border-gray-300 bg-transparent py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-gray-700 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Описание</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
            rows={5}
            className="w-full rounded-xl border border-gray-300 bg-transparent py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-gray-700 resize-none custom-scrollbar transition-all"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Цена */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Цена (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                inputMode="decimal"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full rounded-xl border border-gray-300 bg-transparent py-2.5 pl-8 pr-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-gray-700 transition-all"
              />
            </div>
          </div>

          {/* Статус */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Статус</label>

            {/* Кнопка, которая выглядит как инпут */}
            <button
              type="button"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-gray-300 bg-transparent py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-gray-700 transition-all"
            >
              <span>{formData.status === 'active' ? 'Активен' : 'Черновик (скрыт)'}</span>
              <svg className={`h-4 w-4 text-gray-400 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Сам выпадающий список */}
            {isStatusOpen && (
              <>
                {/* Невидимый фон для закрытия по клику вне списка */}
                <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />

                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-[#121212]">
                  <button
                    type="button"
                    onClick={() => { setFormData({ ...formData, status: 'active' }); setIsStatusOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${formData.status === 'active'
                        ? 'bg-accent/10 text-accent font-medium' // Выбранный: фиолетовый
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' // Невыбранный: серый при наведении
                      }`}
                  >
                    Активен
                  </button>

                  <button
                    type="button"
                    onClick={() => { setFormData({ ...formData, status: 'draft' }); setIsStatusOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${formData.status === 'draft'
                        ? 'bg-accent/10 text-accent font-medium' // Выбранный: фиолетовый
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' // Невыбранный: серый при наведении
                      }`}
                  >
                    Черновик (скрыт)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Теги (через запятую)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={e => setFormData({ ...formData, tags: e.target.value })}
            className="w-full rounded-xl border border-gray-300 bg-transparent py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-gray-700 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Обложка проекта</label>

          {/* Текущая картинка (если новая не выбрана) */}
          {currentImage && !imageFile && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Текущая обложка:</p>
              <img src={currentImage} alt="Текущая" className="h-32 w-auto object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
            </div>
          )}

          {/* Предпросмотр новой картинки */}
          {imageFile && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Новая обложка:</p>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Предпросмотр"
                className="h-32 w-auto object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 file:mr-4 file:rounded-md file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-accent/20"
          />
        </div>

        <button disabled={saving} type="submit" className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50">
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </main>
  );
}