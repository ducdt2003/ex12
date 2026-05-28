import { Dispatch } from "redux";
import authService from "../../services/authService";
import { Credentials } from "../../types";
import { AxiosError } from "axios";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const CLEAR_AUTH_ERROR = "CLEAR_AUTH_ERROR";

// ============ Helper Functions ============
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || "Đăng nhập thất bại";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Đăng nhập thất bại";
};

// ============ Action Creators ============
export const loginAction =
  (credentials: Credentials, callbackSuccess?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const data = await authService.login(credentials);
      localStorage.setItem("accessToken", data.token);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: data.token,
      });
      if (callbackSuccess) callbackSuccess();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      dispatch({
        type: LOGIN_FAILURE,
        payload: errorMessage,
      });
    }
  };

export const clearAuthError = () => (dispatch: Dispatch): void => {
  dispatch({ type: CLEAR_AUTH_ERROR });
};

export const logoutAction = () => (dispatch: Dispatch): void => {
  localStorage.removeItem("accessToken");
  dispatch({ type: LOGOUT });
};
