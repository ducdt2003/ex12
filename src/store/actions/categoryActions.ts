import { Dispatch } from 'redux';
import categoryService from '../../services/categoryService';
import { Category } from '../../types';
import { AxiosError } from 'axios';

// ============ Action Types ============
export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';
export const SET_CATEGORY_FILTER = 'SET_CATEGORY_FILTER';
export const CLEAR_CATEGORIES = 'CLEAR_CATEGORIES';

// ============ Helper Function ============
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || "Failed to fetch categories";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to fetch categories";
};

// ============ Action Creators ============
export const fetchCategoriesRequest = () => ({
  type: FETCH_CATEGORIES_REQUEST,
});

export const fetchCategoriesSuccess = (categories: Category[]) => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload: categories,
});

export const fetchCategoriesFailure = (error: string) => ({
  type: FETCH_CATEGORIES_FAILURE,
  payload: error,
});

export const setCategoryFilter = (filter: string) => ({
  type: SET_CATEGORY_FILTER,
  payload: filter,
});

export const clearCategories = () => ({
  type: CLEAR_CATEGORIES,
});

// ============ Thunk Actions ============
/**
 * Thunk action để fetch danh sách danh mục
 */
export const fetchCategories = () => async (dispatch: Dispatch): Promise<void> => {
  dispatch(fetchCategoriesRequest());
  try {
    const response = await categoryService.getAllCategories();
    const categoriesData = Array.isArray(response.data) ? response.data : [];
    dispatch(fetchCategoriesSuccess(categoriesData));
  } catch (error: unknown) {
    dispatch(fetchCategoriesFailure(getErrorMessage(error)));
  }
};

/**
 * Thunk action để fetch danh mục với phân trang
 */
export const fetchCategoriesPaginated =
  (page: number = 1, limit: number = 10) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch(fetchCategoriesRequest());
    try {
      const response = await categoryService.getCategoriesPaginated(page, limit);
      const categoriesData = Array.isArray(response.data?.content) ? response.data.content : [];
      dispatch(fetchCategoriesSuccess(categoriesData));
    } catch (error: unknown) {
      dispatch(fetchCategoriesFailure(getErrorMessage(error)));
    }
  };

/**
 * Thunk action để tìm kiếm danh mục
 */
export const searchCategories =
  (keyword: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch(fetchCategoriesRequest());
    try {
      const response = await categoryService.searchCategories(keyword);
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      dispatch(fetchCategoriesSuccess(categoriesData));
    } catch (error: unknown) {
      dispatch(fetchCategoriesFailure(getErrorMessage(error)));
    }
  };

