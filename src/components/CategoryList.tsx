import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import '../styles/CategoryList.css';

interface CategoryListProps {
  onSelectCategory: (categoryId: string | number | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9091/api/categories');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(data.data || []);
      setError(null);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Không thể tải danh mục";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string | number) => {
    setSelectedId(categoryId);
    onSelectCategory(categoryId);
  };

  const handleShowAll = () => {
    setSelectedId(null);
    onSelectCategory(null);
  };

  return (
    <div className="category-list">
      <h2>📂 Danh Mục</h2>
      
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải danh mục...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>❌ Lỗi: {error}</p>
          <button onClick={fetchCategories} className="retry-btn">
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="category-content">
          <button
            className={`category-item ${selectedId === null ? 'active' : ''}`}
            onClick={handleShowAll}
          >
            🏪 Tất cả sản phẩm
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-item ${selectedId === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
