const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 通用API调用函数 - 保留以备将来需要调用其他API
export const apiCall = async (
    endpoint: string, 
    options: RequestInit = {}
): Promise<any> => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
    }

    return response.json();
};

// 如果需要调用其他非认证API，可以在这里添加
// 例如：
// export const getRecipes = async () => {
//     return apiCall('/api/recipes', { method: 'GET' });
// }; 