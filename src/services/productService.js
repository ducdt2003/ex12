import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:9091/api";

// Tạo axios instance với base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response, // Trả về response thành công như bình thường
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    // Nếu server trả về message cụ thể thì dùng nó, không thì dùng message mặc định
    let errorMessage = serverMessage;

    if (status === 401) {
      // Lỗi 401: Chưa xác thực
      errorMessage =
        errorMessage || "CHƯA XÁC THỰC - Vui lòng đăng nhập để truy cập tài nguyên";

      // 🌟 Hiển thị toast lỗi
      toast.error("⚠️ " + errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });

      // Xóa token khỏi localStorage vì nó đã hết hạn hoặc không hợp lệ
      localStorage.removeItem("accessToken");

      // 🌟 Chuyển hướng về trang login
      // (Dùng window.location để reload và clear state nếu cần)
      setTimeout(() => {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }, 100);
    } else if (status === 403) {
      // Lỗi 403: Không có quyền
      errorMessage =
        errorMessage ||
        "BẠN KHÔNG CÓ QUYỀN - Vui lòng liên hệ admin để được cấp quyền truy cập tài nguyên";

      // 🌟 Hiển thị toast lỗi
      toast.warning("📑 " + errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    // Cập nhật error.response.data.message để các action có thể sử dụng
    if (error.response?.data) {
      error.response.data.message = errorMessage;
    }

    return Promise.reject(error);
  }
);

// 🌟 INTERCEPTOR REQUEST: Thêm token vào header trước khi gửi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service API cho Products
const productService = {
  /**
   * Lấy danh sách tất cả sản phẩm
   * @returns {Promise} Response data
   */
  getAllProducts: async () => {
    try {
      const response = await apiClient.get("/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  /**
   * Lấy sản phẩm theo ID
   * @param {number} productId - ID sản phẩm
   * @returns {Promise} Response data
   */
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy danh mục theo ID
   * @param {number} categoryId - ID danh mục
   * @returns {Promise} Response data
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await apiClient.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Tìm kiếm sản phẩm theo từ khóa
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Response data
   */
  searchProducts: async (keyword) => {
    try {
      const response = await apiClient.get("/products/search", {
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
   * @param {number} page - Trang (0-indexed)
   * @param {number} limit - Số lượng mỗi trang
   * @returns {Promise} Response data
   */
  getProductsPaginated: async (page = 0, limit = 10) => {
    try {
      const response = await apiClient.get("/products", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy danh sách sản phẩm theo danh mục (có phân trang)
   * @param {number} categoryId - ID của danh mục
   * @param {number} page - Trang hiện tại (0-indexed)
   * @param {number} limit - Số lượng mỗi trang
   * @returns {Promise} Response data
   */
  getProductsByCategory: async (categoryId, page = 0, limit = 10) => {
    try {
      const response = await apiClient.get(`/products/category/${categoryId}`, {
        params: {
          page: page,
          size: limit, // Truyền đúng tên param 'size' mà Backend Spring Boot đang đợi
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
   * @param {Object} productData - Dữ liệu gửi lên { name, price, categoryId }
   * @returns {Promise} Response data từ Backend
   */
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post("/products", productData);
      return response.data; // Trả về cấu trúc { status: 201, message: "...", data: {...} }
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin sản phẩm
   * @param {number|string} id - ID của sản phẩm cần sửa (ví dụ: 45)
   * @param {Object} productData - Dữ liệu chỉnh sửa gửi lên { name, price, categoryId }
   * @returns {Promise} Response data từ Backend
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data; // Trả về { status: 200, message: "...", data: {...} }
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa một sản phẩm theo ID
   * @param {number|string} id - ID của sản phẩm cần xóa từ DB
   * @returns {Promise} Response kết quả từ Backend
   */
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data; // Trả về dạng: { status: 200, message: "Xóa sản phẩm thành công", data: null }
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};



export default productService;
