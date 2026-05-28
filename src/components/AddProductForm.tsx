import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addProduct } from "../store/actions/productActions";
import categoryService from "../services/categoryService";
import { Category } from "../types";
import { AppDispatch } from "../store";

interface AddProductFormProps {
  onFetchDataAgain?: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onFetchDataAgain }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<Category[]>([]);

  // State quản lý các ô input điền form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
  });

  // Lấy danh sách danh mục đổ vào thẻ Select khi mở form
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Không lấy được danh mục", err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate cơ bản đầu vào Frontend
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

    // Gọi action gửi dữ liệu lên Backend
    void dispatch(
      addProduct(bodySubmit, () => {
        // Reset lại form sạch sẽ
        setFormData({ name: "", price: "", categoryId: "" });

        // Nếu có hàm callback tải lại trang từ App.js truyền xuống thì kích hoạt
        if (onFetchDataAgain) onFetchDataAgain();
      })
    );
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px",
        margin: "20px 0",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>➕ Thêm Sản Phẩm Mới</h3>

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
          <label>Giá sản phẩm (VND):</label>
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

        <button
          type="submit"
          style={{
            padding: "8px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          Lưu sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
