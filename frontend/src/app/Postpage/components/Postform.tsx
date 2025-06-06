'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRecipePage() {
  const router = useRouter();
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
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // 如果有图片文件，转换为base64
      if (imageFile) {
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      const recipeData = {
        title,
        country,
        ingredients,
        instructions,
        image_url: imageUrl,
        image_description: imageDescription || null,
      };

      const response = await fetch('http://localhost:8000/recipes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        alert('投稿が完了しました！');
        // フォームをリセット
        setTitle('');
        setCountry('');
        setIngredients([]);
        setInstructions('');
        setImageFile(null);
        setImagePreview(null);
        setImageDescription('');
        
        // トップページに戻る
        router.push('/top-page');
      } else {
        const errorData = await response.json();
        alert(`投稿に失敗しました: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-white/30 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
            世界の料理 投稿フォーム
          </h1>
          <p className="text-gray-600 mt-2">あなたのレシピを世界に共有しよう</p>
          <button
            onClick={() => router.push('/top-page')}
            className="mt-4 text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200"
          >
            ← トップページに戻る
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* タイトル */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">料理名</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
              placeholder="例: 王国の香辛料煮込み"
              required
            />
          </div>

          {/* 国名 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">国名</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
              placeholder="例: エルフの森国"
              required
            />
          </div>

          {/* 食材 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              食材 ({ingredients.length}種類)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                className="flex-1 bg-white/50 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                placeholder="食材を入力（例: トマト、鶏肉）"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                追加
              </button>
            </div>
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 作り方 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">作り方</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
              rows={6}
              placeholder="手順を詳しく説明してください。料理の背景や文化的なストーリーもぜひ！"
              required
            />
          </div>

          {/* 画像アップロード */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              料理画像 (オプション)
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                aria-label="料理画像をアップロード"
                className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="プレビュー"
                    className="w-full max-w-sm h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 画像説明 */}
          {imageFile && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                料理の外観説明 (オプション)
              </label>
              <textarea
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                rows={3}
                placeholder="料理の見た目や色合い、盛り付けなどを説明してください"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || ingredients.length === 0}
            className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
              isSubmitting || ingredients.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? '投稿中...' : '✈️ 投稿する'}
          </button>
        </form>
      </div>
    </div>
  );
}