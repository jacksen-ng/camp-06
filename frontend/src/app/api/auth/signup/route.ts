import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();

        const backendResponse = await fetch('http://localhost:8000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });

        const data = await backendResponse.json();

        if (backendResponse.ok) {
            return NextResponse.json({
                success: true,
                message: 'アカウント作成成功',
                user: data.user,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: data.message || 'アカウント作成に失敗しました',
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({
            success: false,
            message: 'サーバーエラーが発生しました',
        }, { status: 500 });
    }
} 