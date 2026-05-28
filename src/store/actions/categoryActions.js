import categoryService from '../../services/categoryService';

// Action Types
export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';
export const SET_CATEGORY_FILTER = 'SET_CATEGORY_FILTER';
export const CLEAR_CATEGORIES = 'CLEAR_CATEGORIES';

// Action Creators
export const fetchCategoriesRequest = () => ({
  type: FETCH_CATEGORIES_REQUEST,
});

export const fetchCategoriesSuccess = (categories) => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload: categories,
});

export const fetchCategoriesFailure = (error) => ({
  type: FETCH_CATEGORIES_FAILURE,
  payload: error,
});

export const setCategoryFilter = (filter) => ({
  type: SET_CATEGORY_FILTER,
  payload: filter,
});

export const clearCategories = () => ({
  type: CLEAR_CATEGORIES,
});

// Thunk Actions (Async Actions)
/**
 * Thunk action để fetch danh sách danh mục
 */
export const fetchCategories = () => async (dispatch) => {
  dispatch(fetchCategoriesRequest());
  try {
    const response = await categoryService.getAllCategories();
    // Response format: { status: 200, message: "...", data: [...] }
    const categoriesData = Array.isArray(response.data) ? response.data : [];
    dispatch(fetchCategoriesSuccess(categoriesData));
  } catch (error) {
    dispatch(fetchCategoriesFailure(error.message || 'Failed to fetch categories'));
  }
};

/**
 * Thunk action để fetch danh mục với phân trang
 * @param {number} page - Trang
 * @param {number} limit - Số lượng mỗi trang
 */
export const fetchCategoriesPaginated = (page = 1, limit = 10) => async (dispatch) => {
  dispatch(fetchCategoriesRequest());
  try {
    const response = await categoryService.getCategoriesPaginated(page, limit);
    const categoriesData = Array.isArray(response.data) ? response.data : [];
    dispatch(fetchCategoriesSuccess(categoriesData));
  } catch (error) {
    dispatch(fetchCategoriesFailure(error.message || 'Failed to fetch categories'));
  }
};

/**
 * Thunk action để tìm kiếm danh mục
 * @param {string} keyword - Từ khóa tìm kiếm
 */
export const searchCategories = (keyword) => async (dispatch) => {
  dispatch(fetchCategoriesRequest());
  try {
    const response = await categoryService.searchCategories(keyword);
    const categoriesData = Array.isArray(response.data) ? response.data : [];
    dispatch(fetchCategoriesSuccess(categoriesData));
  } catch (error) {
    dispatch(fetchCategoriesFailure(error.message || 'Failed to search categories'));
  }
};
