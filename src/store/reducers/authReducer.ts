import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  CLEAR_AUTH_ERROR,
} from "../actions/authActions";

// ============ State Interface ============
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ============ Action Union Type ============
interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: string;
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

interface ClearAuthErrorAction {
  type: typeof CLEAR_AUTH_ERROR;
}

type AuthAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction
  | ClearAuthErrorAction;

// ============ Initial State ============
const initialState: AuthState = {
  token: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

// ============ Reducer ============
const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        token: null,
        isAuthenticated: false,
        error: action.payload,
      };
    case LOGOUT:
      return { ...state, token: null, isAuthenticated: false, error: null };
    case CLEAR_AUTH_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default authReducer;
