"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push('/top-page');
    } else {
      router.push('/');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-gray-200/80 shadow-sm">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={handleLogoClick}
            className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            架空国家レシピ
          </button>
          
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
              <Link
                href="/recipes"
                className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                レシピ
              </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  サインアップ
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}