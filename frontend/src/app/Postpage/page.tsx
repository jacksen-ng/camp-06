'use client';

import Postform from './components/Postform';

export default function Postpage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 space-y-6">
      <h1 className="text-3xl font-bold">投稿入力</h1>
      <Postform />
    </div>
  );
}