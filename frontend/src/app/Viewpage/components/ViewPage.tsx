'use client';

import { useEffect, useState } from 'react';

type Recipe = {
  id: number;
  title: string;
  detail: string;
};

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // 仮データで初期化（本番は fetch('/api/recipes') など）
    const dummyData: Recipe[] = [
      { id: 1, title: 'トマトパスタ', detail: 'トマトとにんにくのシンプルなパスタです。' },
      { id: 2, title: '照り焼きチキン', detail: '甘辛ダレでご飯が進む定番レシピ。' },
    ];
    setRecipes(dummyData);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">投稿一覧</h2>

      {recipes.length === 0 ? (
        <p className="text-gray-600">まだ投稿はありません。</p>
      ) : (
        <ul className="space-y-4">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-xl font-semibold">{recipe.title}</h3>
              <p className="text-gray-700">{recipe.detail}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}