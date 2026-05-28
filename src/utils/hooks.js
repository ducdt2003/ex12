import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, searchProducts, setProductFilter } from '../store/actions/productActions';

/**
 * Custom hook để sử dụng product data từ Redux
 * @returns {Object} - { products, loading, error, dispatch actions }
 */
export const useProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error, filter } = useSelector((state) => state.product);

  return {
    products,
    loading,
    error,
    filter,
    fetchProducts: () => dispatch(fetchProducts()),
    searchProducts: (keyword) => dispatch(searchProducts(keyword)),
    setFilter: (filterValue) => dispatch(setProductFilter(filterValue)),
  };
};

/**
 * Custom hook để xử lý error
 * @returns {Object} - { error, clearError }
 */
export const useErrorHandler = () => {
  const error = useSelector((state) => state.product.error);
  const dispatch = useDispatch();

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return { error, clearError };
};
