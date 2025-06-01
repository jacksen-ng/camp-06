"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-indigo-600 text-white px-4 py-3">
      <nav className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-6">
        <Link href="/" className="font-bold text-lg">
          架空国家レシピ
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="hover:underline">
            トップ
          </Link>
          <Link href="/about" className="hover:underline">
            説明
          </Link>
        </div>
      </nav>
    </header>
  );
}