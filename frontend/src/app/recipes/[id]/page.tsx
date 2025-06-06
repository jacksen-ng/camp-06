'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Recipe {
  id: number;
  title: string;
  country: string;
  ingredients: string[];
  instructions: string;
  image_url: string | null;
  image_description: string | null;
}

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8000/recipes/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
        } else if (response.status === 404) {
          setError('レシピが見つかりませんでした');
        } else {
          setError('レシピの取得に失敗しました');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError('レシピの取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRecipe();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">レシピを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/top-page')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            トップページに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/top-page')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:underline transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            トップページに戻る
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* 料理画像セクション */}
          {recipe.image_url && (
            <div className="relative h-96 md:h-[500px] bg-gradient-to-b from-gray-100 to-gray-200">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/800x500/E5E7EB/9CA3AF?text=No+Image";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-4 py-2 bg-white/90 text-indigo-700 rounded-full font-bold text-sm">
                    {recipe.country}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {recipe.title}
                </h1>
              </div>
            </div>
          )}

          {/* 画像がない場合のヘッダー */}
          {!recipe.image_url && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-white/20 text-white rounded-full font-bold text-sm">
                  {recipe.country}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {recipe.title}
              </h1>
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-12">
              {/* 食材セクション */}
              <div className="md:col-span-1">
                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                    🥕 食材 <span className="text-sm font-normal">({recipe.ingredients.length}種類)</span>
                  </h2>
                  <div className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-green-100"
                      >
                        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-gray-800 font-medium">{ingredient.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 作り方セクション */}
              <div className="md:col-span-2">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mb-8">
                  <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                    👨‍🍳 作り方
                  </h2>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
                    <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed font-sans">
                      {recipe.instructions}
                    </pre>
                  </div>
                </div>

                {/* 料理の外観説明 */}
                {recipe.image_description && (
                  <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                    <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                      ✨ 料理の外観
                    </h2>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-amber-100">
                      <p className="text-gray-800 leading-relaxed">
                        {recipe.image_description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => router.push('/top-page')}
            className="text-indigo-600 hover:text-indigo-700 hover:underline transition-all duration-200 text-lg"
          >
            他のレシピも見る →
          </button>
        </div>
      </div>
    </div>
  );
} 