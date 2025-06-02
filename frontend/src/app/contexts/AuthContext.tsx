'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    }

    const AuthContext = createContext<AuthContextType | null>(null);

    export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('access_token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
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