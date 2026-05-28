import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAction } from "../store/actions/authActions";
import "../styles/LoginPage.css";
import { RootState, AppDispatch } from "../store";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      return;
    }
    dispatch(
      loginAction(credentials, () => {
        navigate("/products");
      }) as any
    );
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">🔐 Đăng Nhập</h2>

        {error && <div className="error-message">⚠️ {error}</div>}

        <div className="form-group">
          <label>Tài khoản:</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Nhập tên tài khoản..."
          />
        </div>

        <div className="form-group password-group">
          <label>Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu..."
          />
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "⌛ Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
