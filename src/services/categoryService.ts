import axios, { AxiosInstance } from 'axios';
import { Category } from '../types';

const API_BASE_URL = 'http://localhost:9091/api';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  status: number;
  message: string;
  data: {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const categoryService = {
  /**
   * Get all categories
   */
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Search categories by keyword
   */
  searchCategories: async (keyword: string): Promise<ApiResponse<Category[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories/search', {
        params: { keyword },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  },

  /**
   * Get categories with pagination
   */
  getCategoriesPaginated: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Category>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Category>>('/categories', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching paginated categories:', error);
      throw error;
    }
  },
};

export default categoryService;
