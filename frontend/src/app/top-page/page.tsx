'use client';

import TopForm from './components/topform';

export default function TopPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 space-y-6">
      <h1 className="text-3xl font-bold">トップページ</h1>
      <TopForm />
    </div>
  );
}