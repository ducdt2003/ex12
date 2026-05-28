import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  CLEAR_AUTH_ERROR,
} from "../actions/authActions";

const initialState = {
  token: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      // đang gọi API khóa disabled
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
