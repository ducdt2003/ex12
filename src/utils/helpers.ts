import { Product } from '../types';
import { AxiosError } from 'axios';

/**
 * Utility functions cho sản phẩm
 */

/**
 * Format giá tiền thành chuỗi VND
 * @param {number} price - Giá tiền
 * @returns {string} - Giá đã format
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

/**
 * Kiểm tra sản phẩm còn hàng hay không
 * @param {number} stock - Số lượng tồn kho
 * @returns {boolean} - true nếu còn hàng
 */
export const isInStock = (stock: number): boolean => {
  return stock > 0;
};

/**
 * Cắt ngắn văn bản dài
 * @param {string} text - Văn bản
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Văn bản đã cắt
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Xác thực dữ liệu sản phẩm
 * @param {Product} product - Dữ liệu sản phẩm
 * @returns {boolean} - true nếu hợp lệ
 */
export const validateProduct = (product: Product): boolean => {
  return !!(
    product &&
    typeof product === 'object' &&
    product.id &&
    product.name &&
    typeof product.price === 'number'
  );
};

/**
 * Extract error message from AxiosError or unknown error
 * @param {unknown} error - Error object
 * @returns {string} - Error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.message ||
      'Đã xảy ra lỗi'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Đã xảy ra lỗi không xác định';
};
  );
};

/**
 * Lọc sản phẩm theo từ khóa
 * @param {Product[]} products - Mảng sản phẩm
 * @param {string} keyword - Từ khóa tìm kiếm
 * @returns {Product[]} - Mảng sản phẩm đã lọc
 */
export const filterProductsByKeyword = (products: Product[], keyword: string): Product[] => {
  if (!keyword || !Array.isArray(products)) return products;

  const lowerKeyword = keyword.toLowerCase();
  return products.filter(
    (product) =>
      product.name?.toLowerCase().includes(lowerKeyword) ||
      product.description?.toLowerCase().includes(lowerKeyword) ||
      product.category?.toLowerCase().includes(lowerKeyword)
  );
};

/**
 * Sắp xếp sản phẩm
 * @param {Product[]} products - Mảng sản phẩm
 * @param {string} sortBy - Loại sắp xếp
 * @returns {Product[]} - Mảng sản phẩm đã sắp xếp
 */
export const sortProducts = (products: Product[], sortBy: string = 'name'): Product[] => {
  if (!Array.isArray(products)) return [];

  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
    default:
      return sorted.sort((a, b) =>
        (a.name || '').localeCompare((b.name || ''), 'vi')
      );
  }
};

/**
 * Tính giá trung bình
 * @param {Product[]} products - Mảng sản phẩm
 * @returns {number} - Giá trung bình
 */
export const calculateAveragePrice = (products: Product[]): number => {
  if (!Array.isArray(products) || products.length === 0) return 0;
  const total = products.reduce((sum, p) => sum + (p.price || 0), 0);
  return total / products.length;
};

/**
 * Lấy sản phẩm có giá cao nhất
 * @param {Product[]} products - Mảng sản phẩm
 * @returns {Product|null} - Sản phẩm có giá cao nhất
 */
export const getMaxPriceProduct = (products: Product[]): Product | null => {
  if (!Array.isArray(products) || products.length === 0) return null;
  return products.reduce((max, product) =>
    (product.price || 0) > (max.price || 0) ? product : max
  );
};

/**
 * Lấy sản phẩm có giá thấp nhất
 * @param {Product[]} products - Mảng sản phẩm
 * @returns {Product|null} - Sản phẩm có giá thấp nhất
 */
export const getMinPriceProduct = (products: Product[]): Product | null => {
  if (!Array.isArray(products) || products.length === 0) return null;
  return products.reduce((min, product) =>
    (product.price || 0) < (min.price || 0) ? product : min
  );
};
