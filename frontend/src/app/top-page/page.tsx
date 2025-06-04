'use client';

import TopForm from './components/topform';
import { TypeAnimation } from 'react-type-animation';

export default function TopPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 p-6 space-y-10">
      
      {/* アニメーション見出し */}
      <TypeAnimation
        sequence={[
          'ようこそ',
          1200,
          '世界のレシピへ',
          1500,
          '食材から生まれる物語',
          1800,
        ]}
        wrapper="h1"
        cursor={true}
        repeat={Infinity}
        className="text-3xl md:text-4xl font-extrabold text-purple-700 text-center"
      />

      {/* トップフォーム（ボタン＋投稿一覧） */}
      <TopForm />
    </div>
  );
}