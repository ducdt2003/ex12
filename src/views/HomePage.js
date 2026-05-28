import React, { useState, useEffect } from "react";
import ProductsPage from "./ProductsPage";
// import CategoriesPage from './CategoriesPage';
import LandingPage from "./LandingPage";
import "../styles/HomePage.scss";

/**
 * Trang chính với navigation
 * Cho phép chuyển đổi giữa Landing, Products và Categories
 */
const HomePage = () => {
  const [activePage, setActivePage] = useState("landing"); // Mặc định hiển thị landing page

  // Đọc page/tab từ URL khi component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page") || "";
    const tabParam = params.get("tab") || "landing";

    // Nếu có page param, mặc định là products
    if (pageParam) {
      setActivePage("products");
    } else {
      setActivePage(tabParam);
    }
  }, []);

  // Cập nhật URL khi chuyển page/tab
  const handleTabChange = (page) => {
    setActivePage(page);
    const params = new URLSearchParams(window.location.search);

    if (page === "landing") {
      params.delete("tab");
      params.delete("page");
    } else {
      params.set("tab", page);
      params.delete("page");
    }

    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  };

  // Callback từ LandingPage
  const handleNavigateFromLanding = (destination) => {
    handleTabChange(destination);
  };

  return (
    <div className="home-page">
      {activePage !== "landing" && (
        <nav className="home-page__nav">
          <div className="home-page__nav-container">
            <button
              className="home-page__back-button"
              onClick={() => handleTabChange("landing")}
              title="Quay lại trang chủ"
            >
              ← Trang chủ
            </button>

            <div className="home-page__logo">
              <span className="home-page__logo-icon">🛍️</span>
              <span className="home-page__logo-text">My Shop</span>
            </div>

            <div className="home-page__nav-links">
              <button
                className={`home-page__nav-button ${
                  activePage === "categories" ? "active" : ""
                }`}
                onClick={() => handleTabChange("categories")}
              >
                📁 Danh mục
              </button>
              <button
                className={`home-page__nav-button ${
                  activePage === "products" ? "active" : ""
                }`}
                onClick={() => handleTabChange("products")}
              >
                📦 Sản phẩm
              </button>
            </div>
          </div>
        </nav>
      )}

      <div className="home-page__content">
        {activePage === "landing" && (
          <LandingPage onNavigate={handleNavigateFromLanding} />
        )}
        {/* {activePage === 'categories' && <CategoriesPage />} */}
        {activePage === "products" && <ProductsPage />}
      </div>
    </div>
  );
};

export default HomePage;
