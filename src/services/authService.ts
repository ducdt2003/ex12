import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Credentials } from "../types";

const API_BASE_URL = "http://localhost:9091/auth";

interface LoginResponse {
  token: string;
  [key: string]: any;
}

const authService = {
  login: async (credentials: Credentials): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, credentials);
      
      toast.success("Đăng nhập thành công! 🈀", {
        position: "top-right",
        autoClose: 2000,
      });
      
      return response.data;
    } catch (error: unknown) {
      const axiosError = error instanceof AxiosError ? error : new AxiosError('Unknown error');
      const status = axiosError.response?.status;
      const serverMessage = axiosError.response?.data?.message as string | undefined;
      let errorMessage = serverMessage;

      if (status === 401) {
        errorMessage =
          errorMessage || "CHƯA XÁC THỰC - Vui lòng đăng nhập để truy cập tài nguyên";
        
        toast.error("⚠️ " + errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (status === 403) {
        errorMessage =
          errorMessage ||
          "BẠN KHÔNG CÓ QUYỀN - Vui lòng liên hệ admin để được cấp quyền truy cập tài nguyên";
        
        toast.warning("📑 " + errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      
      const customError = new Error(errorMessage || "Đăng nhập thất bại");
      throw customError;
    }
  },
};

export default authService;
