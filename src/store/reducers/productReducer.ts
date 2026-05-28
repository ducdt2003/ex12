import { Product } from '../../types';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SET_PRODUCT_FILTER,
  CLEAR_PRODUCTS,
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  CLEAR_PRODUCT_ERROR,
} from '../actions/productActions';

// ============ State Interface ============
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filter: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isFirst: boolean;
  isLast: boolean;
}

// ============ Action Union Type ============
interface FetchProductsRequestAction {
  type: typeof FETCH_PRODUCTS_REQUEST;
}

interface FetchProductsSuccessAction {
  type: typeof FETCH_PRODUCTS_SUCCESS;
  payload: {
    products: Product[];
    paginationInfo: Record<string, unknown>;
  };
}

interface FetchProductsFailureAction {
  type: typeof FETCH_PRODUCTS_FAILURE;
  payload: string;
}

interface SetProductFilterAction {
  type: typeof SET_PRODUCT_FILTER;
  payload: string;
}

interface ClearProductsAction {
  type: typeof CLEAR_PRODUCTS;
}

interface AddProductRequestAction {
  type: typeof ADD_PRODUCT_REQUEST;
}

interface AddProductSuccessAction {
  type: typeof ADD_PRODUCT_SUCCESS;
  payload: Product;
}

interface AddProductFailureAction {
  type: typeof ADD_PRODUCT_FAILURE;
  payload: string;
}

interface UpdateProductRequestAction {
  type: typeof UPDATE_PRODUCT_REQUEST;
}

interface UpdateProductSuccessAction {
  type: typeof UPDATE_PRODUCT_SUCCESS;
  payload: Product;
}

interface UpdateProductFailureAction {
  type: typeof UPDATE_PRODUCT_FAILURE;
  payload: string;
}

interface DeleteProductRequestAction {
  type: typeof DELETE_PRODUCT_REQUEST;
}

interface DeleteProductSuccessAction {
  type: typeof DELETE_PRODUCT_SUCCESS;
  payload: string | number;
}

interface DeleteProductFailureAction {
  type: typeof DELETE_PRODUCT_FAILURE;
  payload: string;
}

interface ClearProductErrorAction {
  type: typeof CLEAR_PRODUCT_ERROR;
}

type ProductAction =
  | FetchProductsRequestAction
  | FetchProductsSuccessAction
  | FetchProductsFailureAction
  | SetProductFilterAction
  | ClearProductsAction
  | AddProductRequestAction
  | AddProductSuccessAction
  | AddProductFailureAction
  | UpdateProductRequestAction
  | UpdateProductSuccessAction
  | UpdateProductFailureAction
  | DeleteProductRequestAction
  | DeleteProductSuccessAction
  | DeleteProductFailureAction
  | ClearProductErrorAction;

// ============ Initial State ============
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  filter: '',
  totalCount: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  isFirst: true,
  isLast: false,
};

// ============ Reducer ============
const productReducer = (state = initialState, action: ProductAction): ProductState => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
    case ADD_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
    case DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        totalCount: (action.payload.paginationInfo?.totalElements as number) || 0,
        totalPages: (action.payload.paginationInfo?.totalPages as number) || 0,
        currentPage: (action.payload.paginationInfo?.currentPage as number) || 0,
        pageSize: (action.payload.paginationInfo?.pageSize as number) || 10,
        isFirst: (action.payload.paginationInfo?.first as boolean) || false,
        isLast: (action.payload.paginationInfo?.last as boolean) || false,
        error: null,
      };

    case ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: [action.payload, ...state.products],
        error: null,
      };

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
        error: null,
      };

    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.filter((p) => p.id !== action.payload),
        error: null,
      };

    case FETCH_PRODUCTS_FAILURE:
    case ADD_PRODUCT_FAILURE:
    case UPDATE_PRODUCT_FAILURE:
    case DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SET_PRODUCT_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    case CLEAR_PRODUCTS:
      return {
        ...state,
        products: [],
        filter: '',
        error: null,
      };

    case CLEAR_PRODUCT_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default productReducer;
