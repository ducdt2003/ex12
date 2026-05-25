// API configuration
const API_BASE_URL = 'http://localhost:9091/api';

export const apiClient = {
  async fetchCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  async fetchProducts(categoryId = null) {
    let url = `${API_BASE_URL}/products`;
    if (categoryId) url += `?categoryId=${categoryId}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
};
