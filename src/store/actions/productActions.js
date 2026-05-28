import { toast } from "react-toastify";
import productService from "../../services/productService";

// Action Types
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


export const fetchProductsRequest = () => ({
  type: FETCH_PRODUCTS_REQUEST,
});

export const fetchProductsSuccess = (products, paginationInfo = {}) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: { products, paginationInfo },
});

export const fetchProductsFailure = (error) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const setProductFilter = (filter) => ({
  type: SET_PRODUCT_FILTER,
  payload: filter,
});

export const clearProducts = () => ({
  type: CLEAR_PRODUCTS,
});

export const clearProductError = () => ({
  type: CLEAR_PRODUCT_ERROR,
});

export const fetchProducts =
  (page = 0, limit = 10) =>
  async (dispatch) => {
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
    } catch (error) {
      dispatch(
        fetchProductsFailure(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch products",
        ),
      );
    }
  };

export const fetchProductsPaginated =
  (page = 0, limit = 10) =>
  async (dispatch) => {
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
    } catch (error) {
      dispatch(
        fetchProductsFailure(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch products",
        ),
      );
    }
  };

export const searchProducts = (keyword) => async (dispatch) => {
  dispatch(fetchProductsRequest());
  try {
    const response = await productService.searchProducts(keyword);
    const productsData = response.data?.content || [];
    dispatch(fetchProductsSuccess(productsData));
  } catch (error) {
    dispatch(
      fetchProductsFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to search products",
      ),
    );
  }
};

/**
 * Thunk action xử lý thêm mới sản phẩm
 */
/**
 * Thunk action xử lý thêm mới sản phẩm
 * @param {Object} productData - { name, price, categoryId }
 * @param {Function} callbackSuccess - Hàm chạy khi thêm thành công (ví dụ: đóng modal, tải lại dữ liệu)
 */
export const addProduct =
  (productData, callbackSuccess) => async (dispatch) => {
    dispatch({ type: ADD_PRODUCT_REQUEST });
    try {
      const response = await productService.createProduct(productData);

      dispatch({
        type: ADD_PRODUCT_SUCCESS,
        payload: response.data, // Đẩy cục data sản phẩm mới tạo vào Reducer
      });

  
      toast.success("✅ Thêm sản phẩm thành công!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Nếu có truyền hàm xử lý khi thành công thì kích hoạt
      if (callbackSuccess) callbackSuccess();
    } catch (error) {
      // 🌟 IN LOG RA CONSOLE ĐỂ BẠN KIỂM TRA (Nhấn F12 trên trình duyệt để xem)
      console.error("Lỗi hệ thống khi thêm sản phẩm:", error.response);

      // 🌟 ĐÃ SỬA: Ép Axios chọc thẳng vào response data để bốc trường "message" từ Spring Boot
      const serverMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể thêm sản phẩm";

      dispatch({
        type: ADD_PRODUCT_FAILURE,
        payload: serverMessage, // Đẩy câu chữ lỗi chuẩn "CHUA XÁC THỰC..." xuống Reducer
      });

      // 🌟 Hiển thị toast lỗi
      toast.error(`❌ ${serverMessage}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

/**
 * Thunk action để fetch sản phẩm theo danh mục (có phân trang)
 */
export const fetchProductsByCategory =
  (categoryId, page = 0, limit = 10) =>
  async (dispatch) => {
    dispatch(fetchProductsRequest());
    try {
      const response = await productService.getProductsByCategory(
        categoryId,
        page,
        limit,
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
    } catch (error) {
      dispatch(
        fetchProductsFailure(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch products by category",
        ),
      );
    }
  };

/**
 * Thunk action xử lý cập nhật sản phẩm
 * @param {number|string} id - ID sản phẩm
 * @param {Object} productData - { name, price, categoryId }
 * @param {Function} callbackSuccess - Hàm chạy khi cập nhật thành công (ví dụ: đóng form, tải lại dữ liệu)
 */
export const updateProduct =
  (id, productData, callbackSuccess) => async (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    try {
      const response = await productService.updateProduct(id, productData);

      dispatch({
        type: UPDATE_PRODUCT_SUCCESS,
        payload: response.data, // Đẩy cục data sản phẩm sau khi sửa vào Reducer
      });

      toast.success("✅ Cập nhật sản phẩm thành công!", {
        position: "top-right",
        autoClose: 2000,
      });

      if (callbackSuccess) callbackSuccess();
    } catch (error) {
      const serverMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể cập nhật sản phẩm";

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
/**
 * Thunk action xử lý xóa sản phẩm
 */
export const deleteProduct = (id, callbackSuccess) => async (dispatch) => {
  dispatch({ type: DELETE_PRODUCT_REQUEST });
  try {
    await productService.deleteProduct(id);
    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: id,
    });

    // 🌟 Hiển thị toast thành công
    toast.success("✅ Xóa sản phẩm thành công!", {
      position: "top-right",
      autoClose: 2000,
    });

    if (callbackSuccess) callbackSuccess();
  } catch (error) {
    // ✅ Đã sửa: Ép Axios bốc đúng message từ ApiResponse khi xóa lỗi
    const serverMessage =
      error.response?.data?.message ||
      error.message ||
      "Không thể xóa sản phẩm";
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
