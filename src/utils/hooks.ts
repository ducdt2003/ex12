import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, searchProducts, setProductFilter, CLEAR_PRODUCT_ERROR } from '../store/actions/productActions';
import { RootState, AppDispatch } from '../store';

interface UseProductsReturn {
  products: any[];
  loading: boolean;
  error: string | null;
  filter: string;
  fetchProducts: () => void;
  searchProducts: (keyword: string) => void;
  setFilter: (filterValue: string) => void;
}

/**
 * Custom hook để sử dụng product data từ Redux
 */
export const useProducts = (): UseProductsReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, filter } = useSelector((state: RootState) => state.product);

  return {
    products,
    loading,
    error,
    filter,
    fetchProducts: () => void dispatch(fetchProducts()),
    searchProducts: (keyword: string) => void dispatch(searchProducts(keyword)),
    setFilter: (filterValue: string) => void dispatch(setProductFilter(filterValue)),
  };
};

interface UseErrorHandlerReturn {
  error: string | null;
  clearError: () => void;
}

/**
 * Custom hook để xử lý error
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const error = useSelector((state: RootState) => state.product.error);
  const dispatch = useDispatch<AppDispatch>();

  const clearError = (): void => {
    dispatch({ type: CLEAR_PRODUCT_ERROR });
  };

  return { error, clearError };
};
