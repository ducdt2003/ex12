import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "../types";
import "../styles/ProductList.scss";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error?: string | null;
}

/**
 * Linh kiện quản lý và lặp hiển thị danh sách sản phẩm
 */
const ProductList: React.FC<ProductListProps> = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="product-list__loading">
        ⏳ Đang tải danh sách sản phẩm...
      </div>
    );
  }

  if (error) {
    return <div className="product-list__error">⚠️ Lỗi: {error}</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-list__empty">
        📭 Không có sản phẩm nào thuộc danh mục này.
      </div>
    );
  }

  return (
    <div
      className="product-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", // Căn chỉnh layout grid tự động co giãn theo màn hình
        gap: "20px",
      }}
    >
      {products.map((product) => (
        // ✅ Gọi ProductCard xử lý giao diện riêng biệt cho từng phần tử sản phẩm
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
