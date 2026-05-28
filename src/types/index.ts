export interface Product {
  id: string | number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  categoryId?: string | number;
  categoryName?: string;
  stock?: number;
  image?: string;
}

export interface ProductData {
  name: string;
  price: number;
  categoryId: number | string;
  description?: string;
  stock?: number;
  image?: string;
}

export interface Category {
  id: string | number;
  name: string;
}

export interface Credentials {
  username?: string;
  password?: string;
}

export interface User {
  username: string;
  token?: string;
}
