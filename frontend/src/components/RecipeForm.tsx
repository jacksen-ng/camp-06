"use client";

import { useState } from "react";

export default function RecipeForm() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = () => {
    if (input.trim()) {
      setIngredients([...ingredients, input.trim()]);
      setInput("");
    }
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      setRecipe(data.recipe);
    } catch (err) {
      alert("レシピ生成に失敗しました");
    }
    setLoading(false);
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

      {recipe && (
        <pre className="mt-6 whitespace-pre-wrap bg-gray-50 p-4 rounded border text-gray-900">
          {recipe}
        </pre>
      )}
    </div>
  );
}