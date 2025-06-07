'use client';

import { useEffect, useState } from 'react';

type Recipe = {
  id: number;
  title: string;
  country: string;
  ingredients: string[];
  instructions: string;
  image_url?: string;
  image_description?: string;
  user_name?: string;  
};

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setError('認証が必要です');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/recipes/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('レシピの取得に失敗しました');
        }

        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">投稿一覧</h2>
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">投稿一覧</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">投稿一覧</h2>

      {recipes.length === 0 ? (
        <p className="text-gray-600">まだ投稿はありません。</p>
      ) : (
        <ul className="space-y-4">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="border p-4 rounded shadow bg-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{recipe.title}</h3>
                {recipe.user_name && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    投稿者: {recipe.user_name}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">国: {recipe.country}</p>
              <div className="mb-2">
                <h4 className="font-medium text-gray-800">材料:</h4>
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <h4 className="font-medium text-gray-800">作り方:</h4>
                <p className="text-sm text-gray-700">{recipe.instructions}</p>
              </div>
              {recipe.image_url && (
                <div className="mt-2">
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.image_description || recipe.title}
                    className="w-full max-w-md h-48 object-cover rounded"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}