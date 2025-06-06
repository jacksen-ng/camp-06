'use client';

import { useState } from 'react';

export default function CreateRecipePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('投稿が完了しました（仮）');
    setTitle('');
    setContent('');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-white/30 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
            世界の料理 投稿フォーム
          </h1>
          <p className="text-gray-600 mt-2">あなたのレシピを世界に共有しよう</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
              placeholder="例: 王国の香辛料煮込み"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
              rows={6}
              placeholder="料理の背景や文化的なストーリーもぜひ！"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            ✈️ 投稿する
          </button>
        </form>
      </div>
    </div>
  );
}