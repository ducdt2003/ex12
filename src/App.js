import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchProducts,
  fetchProductsByCategory,
} from "./store/actions/productActions";
import LandingPage from "./views/LandingPage";
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";
import Pagination from "./components/Pagination";
import AddProductForm from "./components/AddProductForm";
import "./App.css";
import ProductDetail from "./components/ProductDetail";
import LoginPage from "./views/LoginPage";
import { loginAction, logoutAction } from "./store/actions/authActions";

function App() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { products, loading, currentPage, totalPages, isFirst, isLast } =
    useSelector((state) => state.product);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchProductsByCategory(selectedCategory, 0, 10));
    } else {
      dispatch(fetchProducts(0, 10));
    }
  }, [dispatch, selectedCategory]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      if (selectedCategory) {
        dispatch(fetchProductsByCategory(selectedCategory, newPage, 10));
      } else {
        dispatch(fetchProducts(newPage, 10));
      }
    }
  };

  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* 1. Trang chào mừng */}
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<LoginPage />} />

          {/* 2. Trang cửa hàng chính */}
          <Route
            path="/products"
            element={
              <div className="store-layout">
                <header className="App-header">
                  <h1>🛍️ Cửa Hàng Online</h1>
                </header>
                <div
                  className="container"
                  style={{ display: "flex", gap: "20px", padding: "20px" }}
                >
                  {/* Cột danh mục bên trái */}
                  <aside className="sidebar" style={{ width: "250px" }}>
                    <CategoryList
                      onSelectCategory={(id) => {
                        setSelectedCategory(id);
                      }}
                    />

                    <AddProductForm
                      onFetchDataAgain={() => {
                        if (selectedCategory) {
                          // Nếu đang lọc theo danh mục, thêm xong thì tải lại đúng danh mục đó ở trang đầu
                          dispatch(
                            fetchProductsByCategory(selectedCategory, 0, 10),
                          );
                        } else {
                          dispatch(fetchProducts(0, 10));
                        }
                      }}
                    />
                  </aside>

                  {/* Cột sản phẩm bên phải */}
                  <main
                    className="main-content"
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <ProductList products={products} loading={loading} />

                    {!loading && totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        isFirst={isFirst}
                        isLast={isLast}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </main>
                </div>
              </div>
            }
          />

          <Route path="/products/:id" element={<ProductDetail />} />
          {/* 3. Tự động điều hướng nếu gõ sai URL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
