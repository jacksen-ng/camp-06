"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RecipeForm from "@/app/recipes/components/RecipeForm";

export default function RecipesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 检查登录状态
    const loggedIn = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");
    
    if (loggedIn === "true" && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // この場合はuseEffectによってリダイレクトされる
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              レシピ生成アプリ
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                ようこそ、{username}さん
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="py-10">
        <RecipeForm />
      </main>
    </div>
  );
} 