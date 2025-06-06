'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Recipe = {
  id: number;
  title: string;
  country: string;
  ingredients: string[];
  instructions: string;
  image_url: string | null;
  image_description: string | null;
};

export default function TopForm() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API から実際のレシピデータを取得
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:8000/recipes/');
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          console.error('Failed to fetch recipes');
          setRecipes([]);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const getRecipeDescription = (recipe: Recipe) => {
    // 料理の説明を作成（食材と画像説明を組み合わせ）
    const ingredientsText = recipe.ingredients.slice(0, 3).join(', ');
    const remainingCount = recipe.ingredients.length - 3;
    const ingredientsDescription = remainingCount > 0 
      ? `${ingredientsText}など${remainingCount + 3}種類の食材を使用`
      : `${ingredientsText}を使用`;
    
    return recipe.image_description 
      ? `${ingredientsDescription}。${recipe.image_description}`
      : `${recipe.country}の料理。${ingredientsDescription}。`;
  };

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
              {loading ? (
                <p className="text-gray-500 text-lg">レシピを読み込み中...</p>
              ) : (
                <>
                  <p className="text-gray-500 text-lg">まだ投稿はありません。</p>
                  <p className="text-gray-400 text-sm mt-2">最初のレシピを投稿してみましょう！</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8">
              {recipes.map((recipe, index) => (
                <div 
                  key={recipe.id} 
                  className="group relative bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => router.push(`/recipes/${recipe.id}`)}
                >
                  <div className="flex items-start gap-4">
                    {/* レシピ画像または国旗 */}
                    <div className="flex-shrink-0">
                      {recipe.image_url ? (
                        <img
                          src={recipe.image_url}
                          alt={recipe.title}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${recipe.image_url ? 'hidden' : ''}`}>
                        {recipe.id}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                          {recipe.title}
                        </h3>
                        {recipe.country && (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium">
                            {recipe.country}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-2">
                        {getRecipeDescription(recipe)}
                      </p>
                      {recipe.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {recipe.ingredients.slice(0, 5).map((ingredient, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md"
                            >
                              {ingredient.trim()}
                            </span>
                          ))}
                          {recipe.ingredients.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{recipe.ingredients.length - 5}
                            </span>
                          )}
                        </div>
                      )}
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