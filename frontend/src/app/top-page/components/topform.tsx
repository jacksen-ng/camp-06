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
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="space-y-4">
        <button
          className="w-60 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.push('/recipes')}
        >
          食材生成
        </button>

        <button
          className="w-60 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => router.push('/Postpage')}
        >
          投稿入力
        </button>
      </div>

      {/* 投稿一覧を最初から表示 */}
      <div className="w-full max-w-2xl mt-8 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">投稿一覧</h2>

        {recipes.length === 0 ? (
          <p className="text-gray-600 text-center">まだ投稿はありません。</p>
        ) : (
          <ul className="space-y-4">
            {recipes.map((recipe) => (
              <li key={recipe.id} className="border p-4 rounded shadow-sm bg-gray-50">
                <h3 className="text-xl font-semibold">{recipe.title}</h3>
                <p className="text-gray-700">{recipe.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}