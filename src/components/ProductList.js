import React, { useState, useEffect } from 'react';
import '../styles/ProductList.css';

function ProductList({ categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:9091/api/products';
      
      if (categoryId) {
        url += `?categoryId=${categoryId}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-list">
      <h2>📦 Sản Phẩm</h2>
      
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>❌ Lỗi: {error}</p>
          <button onClick={fetchProducts} className="retry-btn">
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="no-products">
          <p>😞 Không có sản phẩm nào</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.image || 'https://via.placeholder.com/250'} 
                  alt={product.name}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">
                    💰 {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(product.price)}
                  </span>
                  <button className="add-to-cart-btn">🛒 Thêm</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
