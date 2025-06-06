// app/about/page.tsx
export default function AboutPage() {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">このアプリについて</h1>
        <p className="mb-4">
          「架空国家レシピ」は、冷蔵庫にある食材を使って、架空の国の伝統料理を生成するWebアプリです。
          Google GeminiのAIを使って、創造的でユニークなレシピを自動で提案します。
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">使い方</h2>
        <ol className="list-decimal ml-6 space-y-2 text-gray-700">
          <li>冷蔵庫の中にある食材を入力します。</li>
          <li>「レシピを生成」ボタンをクリックします。</li>
          <li>AIが架空の国のレシピを提案します。</li>
        </ol>
        <p className="mt-6 text-gray-600 text-sm">
          ※ 現在はユーザー登録機能なしのシンプルバージョンです。
        </p>
      </div>
    );
  }