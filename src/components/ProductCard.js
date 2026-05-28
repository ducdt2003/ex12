import React from "react";
import { useNavigate } from "react-router-dom"; // Đã tích hợp hook điều hướng
import "../styles/ProductCard.scss";

/**
 * Component hiển thị thông tin chi tiết dạng thẻ cho từng sản phẩm
 * @param {Object} product - Dữ liệu sản phẩm từ Backend
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const {
    id,
    name = "Sản phẩm",
    description = "",
    price = 0,
    image = "",
    categoryName = "", //Thay thế "category" thành "categoryName" khớp với API Spring Boot
    stock = 10, // Giả định stock mặc định nếu backend chưa trả về field này
  } = product || {};

  // Hàm điều hướng xử lý khi người dùng nhấn riêng vào nút "Xem chi tiết"
  const handleViewDetails = (e) => {
    e.stopPropagation(); // Ngăn sự kiện nổi bọt (click trùng)
    navigate(`/products/${id}`); // Điều hướng sang URL: /products/:id
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${id}`)} // ✅ Click vào vùng bất kỳ trên Card cũng xem được chi tiết
      style={{ cursor: "pointer" }}
    >
      <div className="product-card__image-container">
        {image ? (
          <img src={image} alt={name} className="product-card__image" />
        ) : (
          <div className="product-card__placeholder">Không có hình ảnh</div>
        )}
        {stock === 0 && (
          <div className="product-card__out-of-stock">Hết hàng</div>
        )}
      </div>

      <div className="product-card__content">
        <div className="product-card__category">{categoryName}</div>
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__description">{description}</p>

        <div className="product-card__footer">
          <div className="product-card__price">
            <span className="product-card__price-label">Giá:</span>
            <span className="product-card__price-value">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(price)}
            </span>
          </div>
          <span
            className={`product-card__stock ${stock > 0 ? "in-stock" : "out-of-stock"}`}
          >
            {stock > 0 ? `${stock} có sẵn` : "Hết hàng"}
          </span>
        </div>

        <button
          className="product-card__button"
          onClick={handleViewDetails}
          disabled={stock === 0}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
