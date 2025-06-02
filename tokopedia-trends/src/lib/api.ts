// src/lib/api.ts
import { Product, Review, Category, TrendData } from './types';
import { mockProducts, mockCategories, mockReviews } from './mockData';

// Simulasi delay untuk API call
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions untuk development
const useMockData = true; // Set ke false jika sudah ada backend API

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    if (useMockData) {
      await delay(500); // Simulasi loading
      return mockProducts;
    }

    // Real API call (uncomment when backend is ready)
    // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    // import axios from 'axios';
    // const api = axios.create({ baseURL: API_BASE_URL });
    // const response = await api.get<ApiResponse<Product[]>>('/products');
    // return response.data.data;
    return mockProducts;
  },

  getById: async (id: number): Promise<Product> => {
    if (useMockData) {
      await delay(300);
      const product = mockProducts.find((p) => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    }

    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    if (useMockData) {
      await delay(400);
      return mockProducts.filter((p) => p.categoryId === categoryId);
    }

    return mockProducts.filter((p) => p.categoryId === categoryId);
  },

  search: async (query: string): Promise<Product[]> => {
    if (useMockData) {
      await delay(600);
      return mockProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    return mockProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  },
};

// Reviews API
export const reviewsApi = {
  getByProductId: async (productId: number): Promise<Review[]> => {
    if (useMockData) {
      await delay(300);
      return mockReviews.filter((r) => r.productId === productId);
    }

    return mockReviews.filter((r) => r.productId === productId);
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    if (useMockData) {
      await delay(200);
      return mockCategories;
    }

    return mockCategories;
  },
};

// Trends API
export const trendsApi = {
  getTrendsData: async (): Promise<TrendData[]> => {
    if (useMockData) {
      await delay(800);
      // Generate mock trend data
      const mockTrends: TrendData[] = [
        {
          date: '2024-01-01',
          searches: 120,
          productName: 'iPhone 15',
          categoryId: 3,
        },
        {
          date: '2024-01-02',
          searches: 150,
          productName: 'iPhone 15',
          categoryId: 3,
        },
        {
          date: '2024-01-03',
          searches: 180,
          productName: 'iPhone 15',
          categoryId: 3,
        },
        {
          date: '2024-01-04',
          searches: 200,
          productName: 'iPhone 15',
          categoryId: 3,
        },
        {
          date: '2024-01-05',
          searches: 175,
          productName: 'iPhone 15',
          categoryId: 3,
        },
      ];
      return mockTrends;
    }

    return [];
  },
};
