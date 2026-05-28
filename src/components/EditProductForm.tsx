import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateProduct } from "../store/actions/productActions";
import categoryService from "../services/categoryService";
import { Product, Category } from "../types";
import { AppDispatch } from "../store";

interface EditProductFormProps {
  currentProduct: Product;
  onCancel: () => void;
  onRefresh: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ currentProduct, onCancel, onRefresh }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
  });

  // 1. Đổ dữ liệu cũ của sản phẩm cần sửa vào form và lấy danh sách danh mục
  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name || "",
        price: currentProduct.price?.toString() || "",
        categoryId: currentProduct.categoryId?.toString() || "",
      });
    }

    const loadCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
      }
    };
    loadCategories();
  }, [currentProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.warning("⚠️ Vui lòng điền đầy đủ thông tin!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const bodySubmit = {
      name: formData.name,
      price: parseFloat(formData.price),
      categoryId: parseInt(formData.categoryId),
    };

    // Gọi Thunk Action gửi request PUT lên Backend
    dispatch(
      updateProduct(currentProduct.id, bodySubmit, () => {
        if (onRefresh) onRefresh();
      }) as any
    );
  };

  return (
    <div
      style={{
        border: "1px solid #ffc107",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px",
        backgroundColor: "#fffdf6",
        margin: "20px 0",
      }}
    >
      <h3>✏️ Chỉnh Sửa Sản Phẩm (ID: {currentProduct?.id})</h3>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <div>
          <label>Tên sản phẩm:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        <div>
          <label>Giá bán (VND):</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        <div>
          <label>Danh mục sản phẩm:</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            style={{ width: "100%", padding: "6px" }}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: "#ffc107",
              color: "#000",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Cập nhật
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
