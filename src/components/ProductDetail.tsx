import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import productService from "../services/productService";
import EditProductForm from "../components/EditProductForm";
import { Product } from "../types";
import { AppDispatch } from "../store";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const fetchDetail = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      if (id) {
        const response = await productService.getProductById(id);
        setProduct(response.data);
      }
      setLoading(false);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Không thể tải thông tin sản phẩm";
      setError(errorMsg);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id, fetchDetail]);

  const handleDeleteClick = async (): Promise<void> => {
    if (!product || !id) return;

    const isConfirm = window.confirm(
      `⚠️ Bạn có chắc chắn muốn xóa sản phẩm "${product.name}" không?\nHành động này sẽ xóa vĩnh viễn dữ liệu khỏi hệ thống!`,
    );

    if (isConfirm) {
      try {
        const response = await productService.deleteProduct(id);

        if (response.status === 200) {
          toast.success("✅ Xóa sản phẩm thành công!", {
            position: "top-right",
            autoClose: 2000,
          });

          dispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: id });

          setTimeout(() => {
            navigate("/products");
          }, 2000);
        }
      } catch (error: unknown) {
        let serverMessage = "Không thể xóa sản phẩm";
        
        if (error instanceof Error) {
          serverMessage = error.message;
        }

        toast.error(`❌ ${serverMessage}`, {
          position: "top-right",
          autoClose: 3000,
        });

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
            fetchDetail();
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
