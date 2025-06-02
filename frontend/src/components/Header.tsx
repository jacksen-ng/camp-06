"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-indigo-600 text-white px-4 py-3">
      <nav className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-6">
        <Link href="/" className="font-bold text-lg">
          架空国家レシピ
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/" className="hover:underline">
            トップ
          </Link>
          <Link href="/about" className="hover:underline">
            説明
          </Link>
          {status === "loading" ? (
            <span>読み込み中...</span>
          ) : session ? (
            <div className="flex gap-4 items-center">
              <Link href="/recipes" className="hover:underline">
                レシピ
              </Link>
              <span>こんにちは、{session.user?.name}さん</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hover:underline"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link href="/login" className="hover:underline">
                ログイン
              </Link>
              <Link href="/signup" className="hover:underline">
                新規登録
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}