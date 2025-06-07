'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export interface UserInfo {
  email: string;
  user_name: string;
  icon: string | null;
}

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user: UserInfo | null;
    login: (token: string) => void;
    logout: () => void;
    }

    const AuthContext = createContext<AuthContextType | null>(null);

    export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserInfo | null>(null);

    const fetchUserInfo = async (token: string) => {
    try {
        const res = await fetch("http://localhost:8000/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        if (!res.ok) throw new Error("ユーザー情報取得失敗");
        const data = await res.json();
        setUser(data);
    } catch (error) {
        console.error(error);
        logout();
    }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        fetchUserInfo(storedToken);
        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('access_token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
        fetchUserInfo(newToken);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, user, logout }}>
        {children}
        </AuthContext.Provider>
    );
    }

    export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 