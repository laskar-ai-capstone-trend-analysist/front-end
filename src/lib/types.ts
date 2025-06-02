// src/lib/types.ts
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
  review: string;
  rating: number;
  tanggal: string;
  productId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface TrendData {
  date: string;
  searches: number;
  productName: string;
  categoryId: number;
}

// Uncomment saat sudah siap connect ke real API
// export interface ApiResponse<T> {
//   data: T;
//   message: string;
//   status: number;
// }

// export interface ProductWithCategory extends Product {
//   category: Category;
//   averageRating?: number;
//   reviewCount?: number;
// }
