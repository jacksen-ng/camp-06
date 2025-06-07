"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

type Recipe = {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  image_url?: string;
  image_description?: string;
  country?: string;
};

export default function MyRecipesList() {
  const { token, isAuthenticated, user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserName, setNewUserName] = useState("");
  const [nameUpdating, setNameUpdating] = useState(false);
  const [iconUploading, setIconUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    const fetchMyRecipes = async () => {
      try {
        const res = await fetch("http://localhost:8000/recipes/user/me", {
          headers: { Authorization: `Bearer ${token}` },
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

  const handleChangeUserName = async () => {
    if (!newUserName.trim() || !token) return;
    setNameUpdating(true);
    try {
      const res = await fetch("http://localhost:8000/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_name: newUserName }),
      });
      if (!res.ok) {
        const errData = await res.json();
        alert("更新失敗: " + errData.detail);
        return;
      }
      alert("ユーザー名を更新しました。ページを更新します。");
      window.location.reload();
    } catch (err) {
      console.error("ユーザー名更新失敗:", err);
    } finally {
      setNameUpdating(false);
    }
  };

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !token) return;

    const file = e.target.files[0];
    setIconUploading(true);

    const convertToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
    };

    try {
      const base64 = await convertToBase64(file);
      const res = await fetch("http://localhost:8000/user/icon", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ icon_url: base64 }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert("アイコン更新失敗: " + errData.detail);
        return;
      }

      alert("アイコンを更新しました。ページを再読み込みします。");
      window.location.reload();
    } catch (err) {
      console.error("アイコン更新失敗:", err);
      alert("画像のアップロードに失敗しました。");
    } finally {
      setIconUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ✅ 編集機能：ここがレシピ一覧の外に出た部分 */}
      {user && (
        <div className="p-4 border rounded space-y-4">
          <h2 className="text-xl font-bold">プロフィール編集</h2>

          <div>
            <label className="block font-semibold mb-1">現在のユーザー名:</label>
            <p className="mb-2">{user.user_name}</p>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="border p-2 rounded w-full max-w-sm mb-2"
              placeholder="新しいユーザー名"
            />
            <button
              onClick={handleChangeUserName}
              disabled={nameUpdating}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {nameUpdating ? "更新中..." : "ユーザー名を変更"}
            </button>
          </div>

          <div>
            <label className="block font-semibold mb-1">現在のアイコン:</label>
            {user.icon && user.icon.startsWith("data:image/") ? (
              <img
                src={user.icon}
                alt="User Icon"
                className="w-16 h-16 rounded-full border mb-2"
              />
            ) : (
              <p className="text-sm text-gray-500 mb-2">未設定</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleIconChange}
              disabled={iconUploading}
            />
            {iconUploading && <p className="text-sm text-gray-500 mt-1">アップロード中...</p>}
          </div>
        </div>
      )}

    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          自分のレシピ一覧
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
      </div>

      <div className="w-full max-w-4xl">
        <div className="backdrop-blur-sm bg-white/70 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍳</div>
              <p className="text-gray-500 text-lg">まだレシピがありません。</p>
              <p className="text-gray-400 text-sm mt-2">
                最初のレシピを投稿してみましょう！
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8">
              {recipes.map((recipe, index) => {
                const ingredientsArray = recipe.ingredients
                  .split(",")
                  .map((s) => s.trim());
                const getDescription = () => {
                  const base = ingredientsArray.slice(0, 3).join(", ");
                  const remain = ingredientsArray.length - 3;
                  const desc =
                    remain > 0
                      ? `${base}など${ingredientsArray.length}種類の食材を使用`
                      : `${base}を使用`;
                  return recipe.image_description
                    ? `${desc}。${recipe.image_description}`
                    : recipe.country
                    ? `${recipe.country}の料理。${desc}。`
                    : desc;
                };

                return (
                  <div
                    key={recipe.id}
                    className="group relative bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => router.push(`/recipes/${recipe.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {recipe.image_url ? (
                          <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                            recipe.image_url ? "hidden" : ""
                          }`}
                        >
                          {recipe.id}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                            {recipe.title}
                          </h2>
                          {recipe.country && (
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium">
                              {recipe.country}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-2">
                          {getDescription()}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {ingredientsArray.slice(0, 5).map((ing, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md"
                            >
                              {ing}
                            </span>
                          ))}
                          {ingredientsArray.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{ingredientsArray.length - 5}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-500 text-sm mt-2">
                          {recipe.instructions.length > 100
                            ? recipe.instructions.slice(0, 100) + "..."
                            : recipe.instructions}
                        </p>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}