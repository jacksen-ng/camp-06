'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recipeApi } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreateRecipePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('ログインが必要です');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = undefined;

      if (imageFile) {
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      await recipeApi.createRecipe({
        title,
        country,
        ingredients: ingredients,
        instructions,
        image_url: imageUrl,
        image_description: imageDescription || undefined,
      });

      alert('投稿が完了しました！');
      setTitle('');
      setCountry('');
      setIngredients([]);
      setInstructions('');
      setImageFile(null);
      setImagePreview(null);
      setImageDescription('');
      
      router.push('/top-page');
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ログインが必要です</h2>
          <p className="text-gray-600 mb-6">レシピを投稿するにはログインしてください。</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ログインする
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              レシピを投稿する
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                レシピタイトル *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                placeholder="例：トマトパスタ"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                料理の国・地域 *
              </label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                placeholder="例：イタリア"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                材料 *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                  className="flex-1 px-4 py-3 bg-white/50 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder="材料を入力してください"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                >
                  追加
                </button>
              </div>
              {ingredients.length > 0 && (
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <span className="flex-1 text-gray-700">{ingredient}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="instructions" className="block text-sm font-semibold text-gray-700 mb-2">
                作り方 *
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                placeholder="作り方を詳しく説明してください..."
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                料理の画像
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="プレビュー"
                    className="w-full max-w-xs mx-auto rounded-lg shadow-md border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="imageDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                画像の説明
              </label>
              <input
                type="text"
                id="imageDescription"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                placeholder="画像の説明（任意）"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !title || !country || ingredients.length === 0 || !instructions}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? '投稿中...' : 'レシピを投稿する'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}