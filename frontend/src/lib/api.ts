
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};


export const setAuthToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
    }
};


export const clearAuthToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
    }
};


export const createAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};


export const apiCall = async (
    endpoint: string, 
    options: RequestInit = {}
    ): Promise<any> => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
        ...options,
        headers: {
        ...createAuthHeaders(),
        ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
    }

    return response.json();
};


export const loginAPI = async (username: string, password: string) => {
    return apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
};


export const logoutAPI = async () => {
    return apiCall('/api/auth/logout', {
        method: 'POST',
    });
};


export const validateToken = async () => {
    return apiCall('/api/auth/validate', {
        method: 'GET',
    });
}; 