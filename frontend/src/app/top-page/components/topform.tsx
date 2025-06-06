'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Recipe = {
  id: number;
  title: string;
  detail: string;
};

export default function TopForm() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // 仮データ（本番は API から取得）
    const dummyData: Recipe[] = [
      { id: 1, title: 'トマトパスタ', detail: 'トマトとにんにくのシンプルなパスタです。' },
      { id: 2, title: '照り焼きチキン', detail: '甘辛ダレでご飯が進む定番レシピ。' },
    ];
    setRecipes(dummyData);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-4xl">
        <div className="mb-8">
          <p className="text-xl md:text-2xl text-gray-600 font-light">
            美味しいレシピを発見・共有しよう
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 min-w-[200px]"
            onClick={() => router.push('/recipes')}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              🧑‍🍳 食材生成
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 min-w-[200px]"
            onClick={() => router.push('/Postpage')}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              ✍️ 投稿入力
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Recipe List Section */}
      <div className="w-full max-w-4xl">
        <div className="backdrop-blur-sm bg-white/70 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              投稿一覧
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-500 text-lg">まだ投稿はありません。</p>
              <p className="text-gray-400 text-sm mt-2">最初のレシピを投稿してみましょう！</p>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8">
              {recipes.map((recipe, index) => (
                <div 
                  key={recipe.id} 
                  className="group relative bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {recipe.id}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                        {recipe.detail}
                      </p>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors duration-200"
                        aria-label="レシピの詳細を見る"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}