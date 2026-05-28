// Các hằng số API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:9091/api',
  TIMEOUT: 10000,
  ENDPOINTS: {
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id) => `/products/${id}`,
    SEARCH_PRODUCTS: '/products/search',
  },
};

// Các hằng số cho Redux
export const REDUX_ACTION_TYPES = {
  FETCH_REQUEST: 'FETCH_PRODUCTS_REQUEST',
  FETCH_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_FAILURE: 'FETCH_PRODUCTS_FAILURE',
  SET_FILTER: 'SET_PRODUCT_FILTER',
  CLEAR: 'CLEAR_PRODUCTS',
};

// Các hằng số cho sorting
export const SORT_OPTIONS = {
  NAME: 'name',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
};

// Các hằng số cho UI
export const UI_CONSTANTS = {
  GRID_MIN_WIDTH: 250,
  GRID_MIN_WIDTH_TABLET: 220,
  GRID_MIN_WIDTH_MOBILE: 160,
  PAGE_SIZE_DEFAULT: 10,
  LOADING_TIMEOUT: 5000,
};

// Các thông báo lỗi
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Không thể tải sản phẩm. Vui lòng thử lại.',
  NETWORK_ERROR: 'Lỗi kết nối mạng. Kiểm tra kết nối của bạn.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  NOT_FOUND: 'Không tìm thấy sản phẩm.',
};
