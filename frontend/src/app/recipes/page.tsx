"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RecipeForm from "@/app/recipes/components/RecipeForm";

export default function RecipesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 如果未登录，重定向到登录页面
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 显示加载状态
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  // 如果未登录，显示空页面（会被重定向）
  if (!session) {
    return null;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

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
                ようこそ、{session.user?.name}さん
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