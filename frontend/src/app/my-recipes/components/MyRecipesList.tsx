"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

type Recipe = {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
};

export default function MyRecipesPage() {
  const { token, isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    const fetchMyRecipes = async () => {
      try {
        const res = await fetch("http://localhost:8000/recipes/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          setRecipes(await res.json());
        }
      } catch (error) {
        console.error("エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, [isAuthenticated, token]);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">自分のレシピ一覧</h1>
      {recipes.length === 0 ? (
        <p>まだレシピがありません。</p>
      ) : (
        <ul className="space-y-4">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              onClick={() => router.push(`/recipes/${recipe.id}`)}
              className="border p-4 rounded-md shadow-sm hover:bg-gray-50 cursor-pointer transition"
            >
              <h2 className="text-xl font-semibold">{recipe.title}</h2>
              <p>
                <strong>材料:</strong> {recipe.ingredients}
              </p>
              <p>
                <strong>作り方:</strong> {recipe.instructions}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
