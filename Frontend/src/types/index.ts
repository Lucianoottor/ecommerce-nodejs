export interface User {
  id: number;
  email: string;
  birthDate: string | null;
  role: 'admin' | 'user';
  Token?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  productId: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  cartItemId: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  transactionId: number;
  userId: number;
  totalAmount: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiError {
  error: string;
  statusCode: number;
}
