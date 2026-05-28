import authService from "../../services/authService";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const CLEAR_AUTH_ERROR = "CLEAR_AUTH_ERROR";

export const loginAction =
  (credentials, callbackSuccess) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const data = await authService.login(credentials);
      localStorage.setItem("accessToken", data.token);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: data.token,
      });

      if (callbackSuccess) callbackSuccess();
    } catch (error) {
      const errorMessage =
        error.message || error.response?.data?.message || "Đăng nhập thất bại!";

      dispatch({
        type: LOGIN_FAILURE,
        payload: errorMessage,
      });
    }
  };

export const clearAuthError = () => (dispatch) => {
  dispatch({ type: CLEAR_AUTH_ERROR });
};

export const logoutAction = () => (dispatch) => {
  localStorage.removeItem("accessToken");
  dispatch({ type: LOGOUT });
};
