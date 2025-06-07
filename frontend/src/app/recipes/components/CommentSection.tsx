'use client';

import { useState } from 'react';

export default function CommentSection() {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const handlePost = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, newComment.trim()]);
      setNewComment('');
    }
  };

  return (
    <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200 shadow-xl max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">💬 コメントを投稿</h2>

      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows={5}
        placeholder="コメントを入力してください..."
        className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handlePost}
          disabled={newComment.trim() === ''}
          className={`px-6 py-3 text-lg rounded-lg font-semibold transition ${
            newComment.trim() === ''
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          投稿
        </button>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">📋 コメント一覧</h3>
        <ul className="space-y-4">
          {comments.map((comment, idx) => (
            <li
              key={idx}
              className="bg-gray-50 border border-gray-300 rounded-xl p-5 shadow-md"
            >
              <div className="text-base text-gray-500 mb-2">匿名さん</div>
              <p className="text-lg text-gray-800">{comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}