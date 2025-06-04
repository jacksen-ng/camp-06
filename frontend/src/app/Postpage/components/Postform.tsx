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
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/morocco-bg.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-purple-300 space-y-6">
        <h1 className="text-4xl font-bold text-center text-purple-800 tracking-wide">
          🌍 世界の料理 投稿フォーム
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="例: 王国の香辛料煮込み"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              rows={5}
              placeholder="料理の背景や文化的なストーリーもぜひ！"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            ✈️ 投稿する
          </button>
        </form>
      </div>
    </div>
  );
}