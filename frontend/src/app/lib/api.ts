const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Recipe {
  id: number;
  title: string;
  country: string;
  ingredients: string[];
  instructions: string;
  image_url?: string;
  image_description?: string;
  user_name?: string;
  user_icon_url?: string;
}

export interface RecipeCreate {
  title: string;
  country: string;
  ingredients: string[];
  instructions: string;
  image_url?: string;
  image_description?: string;
}

export interface GenerateRecipeRequest {
  ingredients: string[];
}

export interface GenerateRecipeResponse {
  recipe: string;
  image_description: string;
  suggested_images: string[];
  has_image: boolean;
  image_url: string;
  dish_name: string;
  country_name: string;
  ingredients_name: string;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export const authApi = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    return response.json();
  },

  async register(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    return response.json();
  },
};

export const recipeApi = {
  async getRecipes(): Promise<Recipe[]> {
    const response = await fetch(`${API_BASE_URL}/recipes/`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch recipes");
    }

    return response.json();
  },

  async getRecipe(id: number): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch recipe");
    }

    return response.json();
  },

  async createRecipe(data: RecipeCreate): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/recipes/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create recipe");
    }

    return response.json();
  },

  async deleteRecipe(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete recipe");
    }
  },
};

export const geminiApi = {
  async generateRecipe(
    data: GenerateRecipeRequest
  ): Promise<GenerateRecipeResponse> {
    const response = await fetch(`${API_BASE_URL}/gemini/generate-recipe`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to generate recipe");
    }

    return response.json();
  },
};
