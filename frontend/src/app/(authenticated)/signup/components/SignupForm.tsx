'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
        const response = await fetch('http://localhost:8000/auth/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            email,
            password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            login(data.access_token);
            router.push('/recipes');
        } else {
            setError(data.detail || 'Registration failed');
        }
        } catch (error) {
        setError('Registration failed. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/30">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        サインアップ
                    </h1>
                    <p className="text-gray-600 mt-2">新しいアカウントを作成</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    メールアドレス
                    </label>
                    <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                    />
                </div>
                
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    パスワード
                    </label>
                    <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                    />
                </div>

                {error && (
                    <div className="text-red-600 bg-red-100 border border-red-400 text-sm rounded-lg p-3 text-center">{error}</div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    {loading ? '登録中...' : '登録'}
                </button>
                </form>
            </div>
        </div>
    );
}
