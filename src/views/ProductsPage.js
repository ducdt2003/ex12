import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../components/ProductList";
import Pagination from "../components/Pagination";
import "../styles/ProductsPage.scss";
import {
  fetchProducts,
  fetchProductsByCategory,
} from "../store/actions/productActions";

/**
 * Trang hiển thị danh sách sản phẩm với phân trang chuẩn
 */
const ProductsPage = ({ categoryId }) => {
  const dispatch = useDispatch();

  const { products, loading, error, currentPage, totalPages, isFirst, isLast } =
    useSelector((state) => state.product);

  const [retryCount, setRetryCount] = useState(0);

  // Đọc số trang từ URL thanh địa
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get("page") || "0", 10);

    if (categoryId) {
      dispatch(fetchProductsByCategory(categoryId, pageParam, 10));
    } else {
      dispatch(fetchProducts(pageParam, 10));
    }
  }, [dispatch, categoryId, retryCount]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get("page") || "0", 10);

    if (pageParam !== currentPage) {
      params.set("page", currentPage);
      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    }
  }, [currentPage]);

  // 4. LẮNG NGHE KHI ĐỔI DANH MỤC: Ép URL quay về trang 0 lập tức
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("page") !== "0") {
      params.set("page", "0");
      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    }
  }, [categoryId]); // Mỗi lần click danh mục mới là reset page về 0 trên URL

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  //5. HÀM SỬ LÝ KHI NGƯỜI DÙNG CLICK NÚT SỐ TRANG TRÊN THANH PHÂN TRANG
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      // Cập nhật lại số trang mới lên URL trước để Effect #2 không bị lệch nhịp
      const params = new URLSearchParams(window.location.search);
      params.set("page", newPage);
      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`,
      );

      // Gọi API lấy dữ liệu trang mới
      if (categoryId) {
        dispatch(fetchProductsByCategory(categoryId, newPage, 10));
      } else {
        dispatch(fetchProducts(newPage, 10));
      }
    }
  };

  return (
    <div className="products-page">
      <header className="products-page__header">
        <div className="products-page__container">
          <h1 className="products-page__title">Cửa hàng sản phẩm</h1>
          <p className="products-page__subtitle">
            Khám phá bộ sưu tập sản phẩm của chúng tôi
          </p>
        </div>
      </header>

      <main className="products-page__main">
        <div className="products-page__container">
          {error && (
            <div className="products-page__error-banner">
              <div className="products-page__error-content">
                <p className="products-page__error-message">
                  ⚠️ Lỗi khi tải sản phẩm: {error}
                </p>
                <button
                  className="products-page__retry-button"
                  onClick={handleRetry}
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Danh sách sản phẩm hiển thị mảng từ Redux */}
          <ProductList products={products} loading={loading} error={error} />

          {/* HIỂN THỊ THANH PHÂN TRANG CHUẨN (Chỉ hiện khi tổng số trang lớn hơn 1) */}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              isFirst={isFirst}
              isLast={isLast}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>

      <footer className="products-page__footer">
        <div className="products-page__container">
          <p>&copy; 2026 Cửa hàng sản phẩm. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductsPage;
