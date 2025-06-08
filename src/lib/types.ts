// src/lib/types.ts

// Base interfaces sesuai dengan back-end response format
export interface Product {
  id: number;
  name: string;
  currentPrice: number;
  originalPrice: number;
  imgUrl: string;
  stock: number;
  categoryId: number;
  discount: number;
}

export interface Review {
  id: number;
  productId: number;
  rating: number;
  review: string;
  tanggal: string; // Format: "Tue, 01 Apr 2025 10:55:59 GMT"
}

export interface Category {
  id: number;
  name: string;
}

// API Response interface sesuai dengan back-end format
export interface ApiResponse<T> {
  error: boolean;
  message: string;
  data: T;
}

// Sentiment analysis interface untuk future implementation
export interface SentimentData {
  productId: number;
  sentiment_negative: number;
  sentiment_neutral: number;
  sentiment_positive: number;
}

// Extended interfaces untuk UI enhancement
export interface ProductWithCategory extends Product {
  category?: Category;
  averageRating?: number;
  reviewCount?: number;
  sentimentData?: SentimentData;
}

export interface ProductFilters {
  search?: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'discount';
  sortOrder?: 'asc' | 'desc';
}

// Trend data interface
export interface TrendData {
  date: string;
  searches: number;
  productName: string;
  categoryId: number;
}

// Error handling interface
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Search and pagination interfaces
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  category?: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Loading state interface
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: string | null;
}

// Form interfaces
export interface SearchFormData {
  query: string;
  category: string;
}

// Component prop interfaces
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
