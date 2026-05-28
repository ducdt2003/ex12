import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // ✅ Bổ sung để gọi dispatch
import { toast } from "react-toastify";
import { deleteProduct } from "../store/actions/productActions"; // ✅ Import hành động xóa
import productService from "../services/productService";
import EditProductForm from "../components/EditProductForm";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Khởi tạo dispatch

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Không thể tải thông tin sản phẩm");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  // 🌟 Hàm xử lý hành động kích hoạt nút Xóa
  // 🌟 ĐÃ SỬA: Hàm xử lý hành động kích hoạt nút Xóa bắt lỗi trực tiếp từ API
  const handleDeleteClick = async () => {
    const isConfirm = window.confirm(
      `⚠️ Bạn có chắc chắn muốn xóa sản phẩm "${product?.name}" không?\nHành động này sẽ xóa vĩnh viễn dữ liệu khỏi hệ thống!`,
    );

    if (isConfirm) {
      try {
        // 1. Gọi trực tiếp Service (hoặc thông qua Thunk nhưng bọc trong Promise)
        // Cách ăn ngay lập tức là gọi thẳng qua productService để bắt trọn vẹn Http Error
        const response = await productService.deleteProduct(id);

        // 2. Nếu không dính Exception (Xóa thành công ở DB)
        if (response.status === 200) {
          // 🌟 Hiển thị toast thành công
          toast.success("✅ Xóa sản phẩm thành công!", {
            position: "top-right",
            autoClose: 2000,
          });

          // Gửi tín hiệu xuống Redux để đồng bộ xóa sản phẩm ngoài danh sách ngầm
          dispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: id });

          setTimeout(() => {
            navigate("/products"); // Đẩy người dùng quay trở lại trang danh sách
          }, 2000);
        }
      } catch (error) {
        // 3. 🚀 KHU VỰC HỨNG TRỌN VẸN LỖI 401 / 403 TỪ BACKEND
        console.error("Frontend bắt được lỗi xóa sản phẩm:", error.response);

        // Bốc chuẩn xác trường "message" từ cục JSON lỗi của Spring Boot
        const serverMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể xóa sản phẩm";

        // 🌟 Hiển thị toast lỗi
        toast.error(`❌ ${serverMessage}`, {
          position: "top-right",
          autoClose: 3000,
        });

        // (Tùy chọn) Đồng bộ trạng thái lỗi xuống Redux nếu cần dùng ở nơi khác
        dispatch({ type: "DELETE_PRODUCT_FAILURE", payload: serverMessage });
      }
    }
  };

  if (loading)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        ⏳ Đang tải thông tin chi tiết...
      </div>
    );
  if (error)
    return <div style={{ padding: "20px", color: "red" }}>⚠️ Lỗi: {error}</div>;
  if (!product)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        ❌ Không tìm thấy sản phẩm!
      </div>
    );

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/products")}
        style={{
          padding: "8px 16px",
          marginBottom: "20px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        ⬅️ Quay lại cửa hàng
      </button>

      {isEditing ? (
        <EditProductForm
          currentProduct={product}
          onCancel={() => setIsEditing(false)}
          onRefresh={() => {
            setIsEditing(false);
            fetchDetail(); // Reload lại dữ liệu chi tiết mới sau khi cập nhật thành công
          }}
        />
      ) : (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "30px",
            borderRadius: "12px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              background: "#e0e0e0",
              padding: "4px 8px",
              borderRadius: "4px",
              color: "#555",
            }}
          >
            📦 ID sản phẩm: {product.id}
          </span>

          <h1
            style={{ marginTop: "15px", marginBottom: "10px", color: "#333" }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontSize: "24px",
              color: "red",
              fontWeight: "bold",
              margin: "15px 0",
            }}
          >
            Giá bán: {product.price?.toLocaleString()} VND
          </p>

          <p style={{ fontSize: "16px", color: "#666" }}>
            <strong>Danh mục:</strong>{" "}
            {product.categoryName || "Chưa phân loại"}
          </p>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid #eee",
              margin: "20px 0",
            }}
          />

          {/* ✅ KHU VỰC ĐẶT CÁC NÚT ĐIỀU KHIỂN HÀNH ĐỘNG */}
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ffc107",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ⚙️ Chỉnh sửa sản phẩm
            </button>

            <button
              onClick={handleDeleteClick}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🗑️ Xóa sản phẩm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
