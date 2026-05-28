import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:9091/auth";

const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      
      toast.success("Đăng nhập thành công! 🈀", {
        position: "top-right",
        autoClose: 2000,
      });
      
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;
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
      const customError = new Error(errorMessage);
      customError.response = error.response;
      throw customError;
    }
  },
};

export default authService;
