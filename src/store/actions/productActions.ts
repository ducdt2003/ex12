import { Dispatch } from "redux";
import { toast } from "react-toastify";
import productService from "../../services/productService";
import { Product, ProductData } from "../../types";
import { AxiosError } from "axios";

// ============ Action Types ============
export const FETCH_PRODUCTS_REQUEST = "FETCH_PRODUCTS_REQUEST";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";
export const SET_PRODUCT_FILTER = "SET_PRODUCT_FILTER";
export const CLEAR_PRODUCTS = "CLEAR_PRODUCTS";

export const ADD_PRODUCT_REQUEST = "ADD_PRODUCT_REQUEST";
export const ADD_PRODUCT_SUCCESS = "ADD_PRODUCT_SUCCESS";
export const ADD_PRODUCT_FAILURE = "ADD_PRODUCT_FAILURE";

export const UPDATE_PRODUCT_REQUEST = "UPDATE_PRODUCT_REQUEST";
export const UPDATE_PRODUCT_SUCCESS = "UPDATE_PRODUCT_SUCCESS";
export const UPDATE_PRODUCT_FAILURE = "UPDATE_PRODUCT_FAILURE";

export const DELETE_PRODUCT_REQUEST = "DELETE_PRODUCT_REQUEST";
export const DELETE_PRODUCT_SUCCESS = "DELETE_PRODUCT_SUCCESS";
export const DELETE_PRODUCT_FAILURE = "DELETE_PRODUCT_FAILURE";

export const CLEAR_PRODUCT_ERROR = "CLEAR_PRODUCT_ERROR";

// ============ Helper Functions ============
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || "Failed to process";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

// ============ Action Creators ============
export const fetchProductsRequest = () => ({
  type: FETCH_PRODUCTS_REQUEST,
});

export const fetchProductsSuccess = (
  products: Product[],
  paginationInfo: Record<string, unknown> = {}
) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: { products, paginationInfo },
});

export const fetchProductsFailure = (error: string) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const setProductFilter = (filter: string) => ({
  type: SET_PRODUCT_FILTER,
  payload: filter,
});

export const clearProducts = () => ({
  type: CLEAR_PRODUCTS,
});

export const clearProductError = () => ({
  type: CLEAR_PRODUCT_ERROR,
});

// ============ Thunk Actions ============
export const fetchProducts =
  (page: number = 0, limit: number = 10) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch(fetchProductsRequest());
    try {
      const response = await productService.getProductsPaginated(page, limit);
      const productsData = response.data?.content || [];
      const paginationInfo = {
        totalPages: response.data?.totalPages || 0,
        totalElements: response.data?.totalElements || 0,
        currentPage: response.data?.number || 0,
        pageSize: response.data?.size || 10,
        first: response.data?.first || false,
        last: response.data?.last || false,
      };
      dispatch(fetchProductsSuccess(productsData, paginationInfo));
    } catch (error: unknown) {
      dispatch(fetchProductsFailure(getErrorMessage(error)));
    }
  };

export const searchProducts =
  (keyword: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch(fetchProductsRequest());
    try {
      const response = await productService.searchProducts(keyword);
      const productsData = response.data?.content || [];
      dispatch(fetchProductsSuccess(productsData));
    } catch (error: unknown) {
      dispatch(fetchProductsFailure(getErrorMessage(error)));
    }
  };

export const fetchProductsByCategory =
  (categoryId: string | number, page: number = 0, limit: number = 10) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch(fetchProductsRequest());
    try {
      const response = await productService.getProductsByCategory(
        categoryId,
        page,
        limit
      );
      const productsData = response.data?.content || [];
      const paginationInfo = {
        totalPages: response.data?.totalPages || 0,
        totalElements: response.data?.totalElements || 0,
        currentPage: response.data?.number || 0,
        pageSize: response.data?.size || 10,
        first: response.data?.first || false,
        last: response.data?.last || false,
      };
      dispatch(fetchProductsSuccess(productsData, paginationInfo));
    } catch (error: unknown) {
      dispatch(fetchProductsFailure(getErrorMessage(error)));
    }
  };

export const addProduct =
  (productData: ProductData, callbackSuccess?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: ADD_PRODUCT_REQUEST });
    try {
      const response = await productService.createProduct(productData);
      dispatch({
        type: ADD_PRODUCT_SUCCESS,
        payload: response.data,
      });
      toast.success("✅ Thêm sản phẩm thành công!", {
        position: "top-right",
        autoClose: 2000,
      });
      if (callbackSuccess) callbackSuccess();
    } catch (error: unknown) {
      const serverMessage = getErrorMessage(error);
      dispatch({
        type: ADD_PRODUCT_FAILURE,
        payload: serverMessage,
      });
      toast.error(`❌ ${serverMessage}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

export const updateProduct =
  (
    id: string | number,
    productData: ProductData,
    callbackSuccess?: () => void
  ) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    try {
      const response = await productService.updateProduct(id, productData);
      dispatch({
        type: UPDATE_PRODUCT_SUCCESS,
        payload: response.data,
      });
      toast.success("✅ Cập nhật sản phẩm thành công!", {
        position: "top-right",
        autoClose: 2000,
      });
      if (callbackSuccess) callbackSuccess();
    } catch (error: unknown) {
      const serverMessage = getErrorMessage(error);
      dispatch({
        type: UPDATE_PRODUCT_FAILURE,
        payload: serverMessage,
      });
      toast.error(`❌ ${serverMessage}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

export const deleteProduct =
  (id: string | number, callbackSuccess?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: DELETE_PRODUCT_REQUEST });
    try {
      await productService.deleteProduct(id);
      dispatch({
        type: DELETE_PRODUCT_SUCCESS,
        payload: id,
      });
      toast.success("✅ Xóa sản phẩm thành công!", {
        position: "top-right",
        autoClose: 2000,
      });
      if (callbackSuccess) callbackSuccess();
    } catch (error: unknown) {
      const serverMessage = getErrorMessage(error);
      dispatch({
        type: DELETE_PRODUCT_FAILURE,
        payload: serverMessage,
      });
      toast.error(`❌ ${serverMessage}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
