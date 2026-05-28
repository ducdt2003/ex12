import axios from 'axios';

const API_BASE_URL = 'http://localhost:9091/api';

// Tạo axios instance với base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Service API cho Categories
const categoryService = {
  /**
   * Lấy danh sách tất cả danh mục
   * @returns {Promise} Response data
   */
  getAllCategories: async () => {
    try {
      const response = await apiClient.get('/categories');
      // API trả về: { status: 200, message: "...", data: [...] }
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },


  /**
   * Tìm kiếm danh mục theo từ khóa
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} Response data
   */
  searchCategories: async (keyword) => {
    try {
      const response = await apiClient.get('/categories/search', {
        params: { keyword },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  },

  /**
   * Lấy danh mục với phân trang
   * @param {number} page - Trang
   * @param {number} limit - Số lượng mỗi trang
   * @returns {Promise} Response data
   */
  getCategoriesPaginated: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/categories', {
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
