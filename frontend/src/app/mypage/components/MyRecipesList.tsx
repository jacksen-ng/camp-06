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

      {/* ✅ レシピ一覧 */}
      <div>
        <h2 className="text-xl font-bold mb-2">自分のレシピ一覧</h2>
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
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p><strong>材料:</strong> {recipe.ingredients}</p>
                <p><strong>作り方:</strong> {recipe.instructions}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}