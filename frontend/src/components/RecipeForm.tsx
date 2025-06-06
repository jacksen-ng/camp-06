"use client";

import { useState } from "react";

interface RecipeResponse {
  recipe: string;
  image_description: string;
  suggested_images: string[];
  has_image: boolean;
  image_url: string | null;
  dish_name: string;
  country_name: string;
  ingredients_names: string[];
  ingredients_name: string;
}

export default function RecipeForm() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [recipeData, setRecipeData] = useState<RecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (ingredients.length === 0) return;
    setLoading(true);
    setRecipeData(null);
    try {
      const res = await fetch("http://localhost:8000/gemini/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      setRecipeData(data);
    } catch (err) {
      alert("レシピ生成に失敗しました");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!recipeData) return;

    try {
      const res = await fetch("http://localhost:8000/recipes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recipeData.dish_name,
          country: recipeData.country_name,
          ingredients: recipeData.ingredients_name ? 
            recipeData.ingredients_name.split(',').map((s: string) => s.trim()) : 
            ingredients, // fallback to original ingredients if parsing fails
          instructions: recipeData.recipe,
          image_url: recipeData.image_url,
          image_description: recipeData.image_description,
          }),
        });
        
        if (res.ok) {
          alert("保存しました！");
        } else {
          const errorData = await res.json();
          alert(`保存に失敗しました: ${errorData.detail || 'Unknown error'}`);
        }
      } catch (error) {
        alert("保存に失敗しました");
      }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Enterキー無効化（送信も追加もしない）
            }
          }}
          placeholder="食材を入力 (例: トマト, 鶏肉)"
          className="border border-gray-300 p-2 flex-1 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          onClick={handleAddIngredient}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          追加
        </button>
      </div>

      {ingredients.length > 0 && (
        <p className="mb-4 text-gray-600">
          現在の食材: {ingredients.join(", ")}
        </p>
      )}

      <button
        onClick={handleGenerate}
        disabled={ingredients.length === 0 || loading}
        className={`w-full py-2 rounded text-white ${
          ingredients.length === 0 || loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "生成中..." : "レシピを生成"}
      </button>
      <button
        onClick={handleSave}
        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
        レシピを保存
      </button>

      {/* レシピ表示セクション */}
      {recipeData && (
        <div className="space-y-6">
          {/* レシピテキスト */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">生成されたレシピ</h3>
            <pre className="whitespace-pre-wrap text-gray-900 font-mono text-sm leading-relaxed">
              {recipeData.recipe}
            </pre>
          </div>

          {/* 画像説明 */}
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold mb-3 text-amber-800">料理の外観</h3>
            <p className="text-amber-900 leading-relaxed">
              {recipeData.image_description}
            </p>
          </div>

          {/* 実際の生成画像 */}
          {recipeData.has_image && recipeData.image_url && (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold mb-4 text-green-800">
                生成された料理画像: {recipeData.dish_name}
              </h3>
              <div className="flex justify-center">
                <img
                  src={recipeData.image_url}
                  alt={`Generated image of ${recipeData.dish_name}`}
                  className="max-w-full h-auto rounded-lg shadow-lg border-2 border-green-300"
                  style={{ maxHeight: '400px' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x300/E5E7EB/9CA3AF?text=Image+Error";
                  }}
                />
              </div>
              <p className="text-sm text-green-600 mt-3 text-center">
                ✨ AI生成による {recipeData.dish_name} の画像
              </p>
            </div>
          )}

          {/* プレースホルダー画像ギャラリー（実際の画像がない場合） */}
          {!recipeData.has_image && recipeData.suggested_images && recipeData.suggested_images.length > 0 && (
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold mb-4 text-purple-800">
                イメージ画像: {recipeData.dish_name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recipeData.suggested_images.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`Recipe image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/400x300/E5E7EB/9CA3AF?text=No+Image";
                      }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-purple-600 mt-3">
                ※ これらはプレースホルダー画像です。実際の料理の見た目とは異なる場合があります。
              </p>
            </div>
          )}

          {/* 画像生成に失敗した場合の表示 */}
          {!recipeData.has_image && (!recipeData.suggested_images || recipeData.suggested_images.length === 0) && (
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold mb-3 text-red-800">画像生成について</h3>
              <p className="text-red-700">
                申し訳ございませんが、画像の生成に失敗しました。レシピの説明をご参考ください。
              </p>
            </div>
          )}
        </div>
      
      )}
    </div>
  );
}