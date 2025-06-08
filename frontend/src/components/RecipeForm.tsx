"use client";

import { useState } from "react";
import { geminiApi, recipeApi, GenerateRecipeResponse } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';

export default function RecipeForm() {
  const { isAuthenticated } = useAuth();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [recipeData, setRecipeData] = useState<GenerateRecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ← モーダル状態を追加

  const handleAddIngredient = () => {
    if (input.trim()) {
      setIngredients([...ingredients, input.trim()]);
      setInput("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0 || !isAuthenticated) return;
    setLoading(true);
    setRecipeData(null);
    try {
      const data = await geminiApi.generateRecipe({ ingredients });
      setRecipeData(data);
    } catch (err) {
      alert("レシピ生成に失敗しました");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!recipeData || !isAuthenticated) return;

    try {
      const ingredientsArray = recipeData.ingredients_name ? 
        recipeData.ingredients_name.split(',').map(s => s.trim()).filter(s => s.length > 0) : 
        ingredients;

      await recipeApi.createRecipe({
        title: recipeData.dish_name,
        country: recipeData.country_name,
        ingredients: ingredientsArray,
        instructions: recipeData.recipe,
        image_url: recipeData.image_url || undefined,
        image_description: recipeData.image_description,
      });
      
      alert("保存しました！");
    } catch (error) {
      alert("保存に失敗しました");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ログインが必要です</h2>
          <p className="text-gray-600">レシピを生成するにはログインしてください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">レシピ生成</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">材料を追加</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: トマト、鶏肉"
            />
            <button
              onClick={handleAddIngredient}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              追加
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">追加された材料:</h3>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {ingredient}
                <button
                  onClick={() => handleRemoveIngredient(index)}
                  className="text-red-500 hover:text-red-700 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={ingredients.length === 0 || loading}
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed mb-6"
        >
          {loading ? "生成中..." : "レシピを生成"}
        </button>

        {recipeData && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">{recipeData.dish_name}</h2>
            <p className="text-sm text-gray-600 mb-2">国: {recipeData.country_name}</p>

            {recipeData.image_url && (
              <div
                className="relative group w-full max-w-md mx-auto mb-4 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <img
                  src={recipeData.image_url}
                  alt={recipeData.dish_name}
                  className="w-full rounded-lg object-cover"
                />

                {/* オーバーレイ＋アイコン */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* モーダル */}
            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full mx-4 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ✕
                  </button>
                  <img
                    src={recipeData.image_url}
                    alt={recipeData.dish_name}
                    className="w-full h-auto rounded"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-semibold mb-2">作り方:</h3>
              <p className="whitespace-pre-wrap text-gray-700">{recipeData.recipe}</p>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              レシピを保存
            </button>
          </div>
        )}
      </div>
    </div>
  );
}