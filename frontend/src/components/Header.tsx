"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Image from "next/image";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push("/top-page");
    } else {
      router.push("/");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className='sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-gray-200/80 shadow-sm'>
      <nav className='max-w-6xl mx-auto px-6 py-4'>
        <div className='flex justify-between items-center'>
          <button
            onClick={handleLogoClick}
            type='button'
            className='cursor-pointer bg-none border-none p-0'
          >
            <Image
              src='/logo-image.png'
              alt='logo'
              width={250}
              height={80}
              priority
              style={{ width: "auto", height: "auto" }} // アスペクト比維持
            />
          </button>

          <div className='flex items-center gap-6'>
            {isAuthenticated ? (
              <>
                <Link
                  href='/recipes'
                  className='font-medium text-gray-700 hover:text-indigo-600 transition-colors'
                >
                  レシピ
                </Link>

                <button
                  onClick={handleLogout}
                  className='px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all'
                >
                  ログアウト
                </button>

                {user?.icon && user.icon.startsWith("data:image/") ? (
                  <img
                    src={user.icon}
                    alt='ユーザーアイコン'
                    className='w-10 h-10 rounded-full border border-gray-300 shadow cursor-pointer'
                    onClick={() => router.push("/mypage")}
                  />
                ) : (
                  <div
                    onClick={() => router.push("/mypage")}
                    className='w-10 h-10 rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center cursor-pointer'
                  >
                    <span className='text-sm text-gray-500'>👤</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  href='/login'
                  className='font-medium text-gray-700 hover:text-indigo-600 transition-colors'
                >
                  ログイン
                </Link>
                <Link
                  href='/signup'
                  className='px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all'
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
