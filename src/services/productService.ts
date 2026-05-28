import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";

// ============ Type Definitions ============
interface ProductData {
  name: string;
  price: number;
  categoryId: number;
  [key: string]: string | number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  [key: string]: any;
}

interface Category {
  id: number;
  name: string;
  [key: string]: any;
}

interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

interface PaginatedResponse<T = any> {
  status: number;
  message: string;
  data: {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
  };
}

// ============ API Client Setup ============
const API_BASE_URL = "http://localhost:9091/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;
    let errorMessage = serverMessage;

    if (status === 401) {
      errorMessage =
        errorMessage || "CHƯA XÁC THỰC - Vui lòng đăng nhập để truy cập tài nguyên";

      toast.error("⚠️ " + errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });

      localStorage.removeItem("accessToken");

      setTimeout(() => {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }, 100);
    } else if (status === 403) {
      errorMessage =
        errorMessage ||
        "BẠN KHÔNG CÓ QUYỀN - Vui lòng liên hệ admin để được cấp quyền truy cập tài nguyên";

      toast.warning("📑 " + errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    if (error.response?.data) {
      error.response.data.message = errorMessage;
    }

    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const productService = {
  /**
   * Lấy danh sách tất cả sản phẩm
   */
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>("/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  /**
   * Lấy sản phẩm theo ID
   */
  getProductById: async (productId: string | number): Promise<ApiResponse<Product>> => {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy danh mục theo ID
   */
  getCategoryById: async (categoryId: string | number): Promise<ApiResponse<Category>> => {
    try {
      const response = await apiClient.get<ApiResponse<Category>>(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Tìm kiếm sản phẩm theo từ khóa
   */
  searchProducts: async (keyword: string): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>("/products/search", {
        params: { keyword },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  /**
   * Lấy sản phẩm với phân trang
   */
  getProductsPaginated: async (page: number = 0, limit: number = 10): Promise<PaginatedResponse<Product>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>("/products", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy danh sách sản phẩm theo danh mục (có phân trang)
   */
  getProductsByCategory: async (
    categoryId: string | number,
    page: number = 0,
    limit: number = 10
  ): Promise<PaginatedResponse<Product>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>(`/products/category/${categoryId}`, {
        params: {
          page: page,
          size: limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching products for category ${categoryId}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Tạo mới một sản phẩm
   */
  createProduct: async (productData: ProductData): Promise<ApiResponse<Product>> => {
    try {
      const response = await apiClient.post<ApiResponse<Product>>("/products", productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin sản phẩm
   */
  updateProduct: async (id: string | number, productData: ProductData): Promise<ApiResponse<Product>> => {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa một sản phẩm theo ID
   */
  deleteProduct: async (id: string | number): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};

export default productService;
