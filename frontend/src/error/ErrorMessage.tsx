'use client';

import { useRouter } from 'next/navigation';

interface ErrorMessageProps {
  error: string;
  isAuthenticated: boolean;
}

export default function ErrorMessage({ error, isAuthenticated }: ErrorMessageProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        {!isAuthenticated ? (
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ログインする
          </button>
        ) : (
          <button
            onClick={() => router.push('/top-page')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            トップページに戻る
          </button>
        )}
      </div>
    </div>
  );
} 