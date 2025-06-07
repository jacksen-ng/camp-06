"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useParams } from "next/navigation";

export default function CommentSection() {
  const [comments, setComments] = useState<
    { comment_text: string; user_name: string }[]
  >([]);
  const [newComment, setNewComment] = useState("");
  const { token } = useAuth();
  const params = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`http://localhost:8000/comments/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    };
    fetchComments();
  }, [params.id]);

  const handlePost = async () => {
    if (newComment.trim() === "") return;
    try {
      const res = await fetch(`http://localhost:8000/comments/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment_text: newComment }),
      });
      if (!res.ok) throw new Error("コメント投稿に失敗しました");
      setNewComment("");
      // 投稿後に再取得
      const res2 = await fetch(`http://localhost:8000/comments/${params.id}`);
      if (res2.ok) {
        const data = await res2.json();
        setComments(data);
      }
    } catch (e) {
      alert("コメント投稿に失敗しました");
    }
  };

  return (
    <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200 shadow-xl max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">
        💬 コメントを投稿
      </h2>

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
          disabled={newComment.trim() === ""}
          className={`px-6 py-3 text-lg rounded-lg font-semibold transition ${
            newComment.trim() === ""
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          投稿
        </button>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          📋 コメント一覧
        </h3>
        <ul className="space-y-4">
          {comments.map((comment, idx) => (
            <li key={idx}>
              <div>{comment.user_name}</div>
              <div>{comment.comment_text}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
