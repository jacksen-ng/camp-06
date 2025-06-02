import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
        name: 'credentials',
        credentials: {
            username: { label: 'Username', type: 'text' },
            password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
            if (!credentials?.username || !credentials?.password) {
                return null;
            }

            try {
                const res = await fetch('http://localhost:8000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password,
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    return {
                        id: data.user.id.toString(),
                        name: data.user.username,
                        email: data.user.email,
                    };
                }
            } catch (error) {
                console.error('Auth error:', error);
            }

            return null;
        }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token.id = user.id
        }
        return token
        },
        async session({ session, token }) {
        if (token && session.user) {
            (session.user as any).id = token.id as string
        }
        return session
        },
        async redirect({ url, baseUrl }) {
            // 简化重定向逻辑
            // 如果URL已经是绝对路径且在同一域下，直接使用
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`
            }
            // 如果是完整URL且在同一域下，直接使用
            if (new URL(url).origin === baseUrl) {
                return url
            }
            // 默认重定向到首页
            return baseUrl
        },
    },
})

export { handler as GET, handler as POST } 