import React, { useState } from 'react';
import './App.css';
import { CategoryList } from './components/category/CategoryList';
import { ProductList } from './components/product/ProductList';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛍️ Cửa Hàng Online</h1>
      </header>
      <div className="container">
        <aside className="sidebar">
          <CategoryList 
            selectedId={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </aside>
        <main className="main-content">
          <ProductList categoryId={selectedCategory} />
        </main>
      </div>
    </div>
  );
}

export default App;
