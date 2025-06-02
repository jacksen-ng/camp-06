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
      router.push('/recipes');
    } else {
      router.push('/');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-indigo-600 text-white px-4 py-3">
      <nav className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-6">
        <button 
          onClick={handleLogoClick}
          className="font-bold text-lg hover:underline cursor-pointer"
        >
          架空国家レシピ
        </button>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleLogoClick}
                className="hover:underline"
              >
                レシピ
              </button>
              <button
                onClick={handleLogout}
                className="hover:underline text-red-200 hover:text-red-100"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                ログイン
              </Link>
              <Link href="/signup" className="hover:underline">
                サインアップ
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}