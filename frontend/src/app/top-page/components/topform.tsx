'use client';

import { useRouter } from 'next/navigation';

export default function TopForm() {
  const router = useRouter();
 //login成功するとこのページにリダイレクトされる

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        className="w-60 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => router.push('/recipes')}
      >
        食材生成
      </button>

      <button
        className="w-60 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={() => router.push('/recipes/list')}
      >
        投稿閲覧
      </button>

      <button
        className="w-60 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        onClick={() => router.push('/recipes/create')}
      >
        投稿入力
      </button>
    </div>
  );
}