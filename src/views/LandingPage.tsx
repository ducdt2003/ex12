import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../store/actions/authActions";
import "../styles/LandingPage.scss";
import { RootState, AppDispatch } from "../store";

interface LandingPageProps {
  onNavigate?: (destination: string) => void;
}

/**
 * Trang landing - trang mặc định khi vào ứng dụng
 */
const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // 🌟 Lấy trạng thái đăng nhập từ Redux Store công cộng
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  // 🌟 Hàm xử lý khi người dùng click vào nút Auth
  const handleAuthClick = () => {
    if (isAuthenticated) {
      dispatch(logoutAction() as any);
      alert("👋 Bạn đã đăng xuất thành công!");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="landing-page">
      <nav className="landing-page__nav">
        <div className="landing-page__nav-container">
          <div className="landing-page__logo">
            <span className="landing-page__logo-icon">🛍️</span>
            <span className="landing-page__logo-text">My Shop</span>
          </div>

          <div className="landing-page__auth-box">
            <button
              onClick={handleAuthClick}
              className={`landing-page__auth-button ${
                isAuthenticated
                  ? "landing-page__auth-button--logout"
                  : "landing-page__auth-button--login"
              }`}
            >
              {isAuthenticated ? "🚪 Đăng xuất" : "🔐 Đăng nhập"}
            </button>
          </div>
        </div>
      </nav>

      <main className="landing-page__main">
        <div className="landing-page__content">
          <h1 className="landing-page__title">Hello App 👋</h1>
          <p className="landing-page__subtitle">
            Chào mừng đến với cửa hàng sản phẩm của chúng tôi
          </p>

          <div className="landing-page__buttons">
            <button
              className="landing-page__button landing-page__button--primary"
              onClick={() => handleNavigate("/products")}
            >
              📁 Xem Danh Mục
            </button>
          </div>
        </div>
      </main>

      <footer className="landing-page__footer">
        <p>&copy; 2026 My Shop. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
