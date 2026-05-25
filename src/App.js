import React, { useState, useEffect } from 'react';
import './App.css';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛍️ Cửa Hàng Online</h1>
      </header>
      <div className="container">
        <aside className="sidebar">
          <CategoryList onSelectCategory={setSelectedCategory} />
        </aside>
        <main className="main-content">
          <ProductList categoryId={selectedCategory} />
        </main>
      </div>
    </div>
  );
}

export default App;
