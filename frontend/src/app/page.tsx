"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">初期ページ</h1>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            ログイン
          </button>
          
          <button 
            onClick={handleSignup}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            新規登録
          </button>
        </div>
      </div>
    </div>
  );
}