'use client';

import Postform from './components/Postform';

export default function Postpage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 p-20">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">投稿入力</h1>
      <Postform />
    </div>
  );
}