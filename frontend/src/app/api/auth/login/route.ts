import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        const backendResponse = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
        }),
        });

        const data = await backendResponse.json();

        if (backendResponse.ok) {
        return NextResponse.json({
            success: true,
            message: 'ログイン成功',
            user: data.user,
            token: data.token, 
        });
        } else {
        return NextResponse.json({
            success: false,
            message: data.message || 'ログインに失敗しました',
        }, { status: 401 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({
        success: false,
        message: 'サーバーエラーが発生しました',
        }, { status: 500 });
    }
} 