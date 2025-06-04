'use client';

import ViewForm from './components/ViewPage';

export default function ViewPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 space-y-6">
      <h1 className="text-3xl font-bold">投稿閲覧</h1>
      <ViewForm />
    </div>
  );
}