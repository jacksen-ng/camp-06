'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function LoginForm() {
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
        const response = await fetch('http://localhost:8000/auth/login', {
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
            if (data.detail && data.detail.includes('Invalid credentials')) {
            router.push('/signup');
            } else {
            setError(data.detail || 'Login failed');
            }
        }
        } catch (error) {
        setError('Login failed. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
            </label>
            <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            パスワード
            </label>
            <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>

        {error && (
            <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
            {loading ? 'Logging in...' : 'Login'}
        </button>
        </form>
    );
}
