"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!username.trim() || !password.trim()) {
        alert("ユーザー名とパスワードを入力してください");
        return;
        }

        setLoading(true);
        
        setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        
        alert("ログイン成功！");
        
        router.push("/recipes");
        
        setLoading(false);
        }, 1000); 
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
            <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                アカウントにログイン
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                任意の文字を入力してログインできます
            </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                <label htmlFor="username" className="sr-only">
                    ユーザー名
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="ユーザー名"
                />
                </div>
                <div>
                <label htmlFor="password" className="sr-only">
                    パスワード
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="パスワード"
                />
                </div>
            </div>

            <div>
                <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
                >
                {loading ? "ログイン中..." : "ログイン"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}
