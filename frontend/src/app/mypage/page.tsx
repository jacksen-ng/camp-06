"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import MyRecipesList from "./components/MyRecipesList";

export default function MyPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-gray-600 text-xl">ログインが必要です</p>
        <button
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={() => router.push("/login")}
        >
          ログインへ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6">
      <div className="flex items-center gap-4 mb-8">
        {user.icon && user.icon.startsWith("data:image/") ? (
          <img
            src={user.icon}
            alt="アイコン"
            className="w-16 h-16 rounded-full border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full border bg-gray-200 flex items-center justify-center">
            <span className="text-sm text-gray-500">No Image</span>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold">{user.user_name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <MyRecipesList />
    </div>
  );
}