// src/lib/api.ts
import axios from 'axios';
import { Product, Review, Category, TrendData, SentimentData } from './types';
import { debug } from './debug';
import { errorLogger } from './errorLogger';
import { performanceMonitor } from './performance';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    const requestId = `${config.method?.toUpperCase()}_${config.url}_${Date.now()}`;
    debug.apiCall(config.method || 'GET', config.url || '', config.data);
    performanceMonitor.start(`api-${requestId}`);

    // Add request ID to config for response tracking
    config.metadata = { requestId };
    return config;
  },
  (error) => {
    debug.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    const requestId = response.config.metadata?.requestId;
    if (requestId) {
      const duration = performanceMonitor.end(`api-${requestId}`) || 0;
      debug.apiResponse(
        response.config.method || 'GET',
        response.config.url || '',
        response.status,
        duration
      );
    }
    return response;
  },
  (error) => {
    const requestId = error.config?.metadata?.requestId;
    if (requestId) {
      performanceMonitor.end(`api-${requestId}`);
    }

    debug.apiError(
      error.config?.method || 'GET',
      error.config?.url || '',
      error
    );

    // Log to error logger
    errorLogger.logApiError(
      error.config?.method || 'GET',
      error.config?.url || '',
      error.response?.status,
      error.message,
      {
        responseData: error.response?.data,
        requestData: error.config?.data,
      }
    );

    console.error('API Error:', error);
    if (error.response?.status === 500) {
      throw new Error(
        'Server sedang mengalami gangguan. Silakan coba lagi nanti.'
      );
    }
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        'Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.'
      );
    }
    return Promise.reject(error);
  }
);

// API Response interface based on back-end response format
interface ApiResponse<T> {
  error: boolean;
  message: string;
  data: T;
}

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const operationName = 'productsApi.getAll';
    try {
      debug.info(`Starting ${operationName}`);
      const response = await api.get<ApiResponse<Product[]>>('/getAllProduct');

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      debug.info(`${operationName} completed successfully`, {
        count: response.data.data.length,
      });

      return response.data.data;
    } catch (error) {
      errorLogger.logApiError(
        'GET',
        '/getAllProduct',
        undefined,
        `${operationName} failed`
      );
      console.error(`Error in ${operationName}:`, error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Product> => {
    try {
      const response = await api.get<ApiResponse<Product>>(
        `/getProductById/${id}`
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        `/getAllProductByCategory`,
        {
          params: { category: categoryId.toString() },
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  search: async (query: string): Promise<Product[]> => {
    try {
      // Ubah dari /searchProduct ke /getAllProductsByName
      const response = await api.get<ApiResponse<Product[]>>(
        `/getAllProductsByName`,
        {
          params: { name: query }, // Ubah parameter dari 'query' ke 'name'
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },
};

// Reviews API
export const reviewsApi = {
  getAll: async (): Promise<Review[]> => {
    try {
      const response = await api.get<ApiResponse<Review[]>>('/getAllReview');
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  getByProductId: async (productId: number): Promise<Review[]> => {
    try {
      const response = await api.get<ApiResponse<Review[]>>(
        `/getAllReviewByProduct`,
        {
          params: { product: productId.toString() },
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reviews by product ID:', error);
      throw error;
    }
  },

  getByCategory: async (categoryId: number): Promise<Review[]> => {
    try {
      const response = await api.get<ApiResponse<Review[]>>(
        `/getAllReviewByCategory`,
        {
          params: { category: categoryId.toString() },
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reviews by category:', error);
      throw error;
    }
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response =
        await api.get<ApiResponse<Category[]>>('/getAllCategory');
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};

// Sentiment Analysis API
export const sentimentApi = {
  getByProductId: async (productId: number): Promise<SentimentData[]> => {
    try {
      const response = await api.get<ApiResponse<SentimentData[]>>(
        `/getSentimentByProduct`,
        {
          params: { product: productId.toString() },
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      throw error;
    }
  },
};

// Health check API
export const healthApi = {
  check: async (): Promise<boolean> => {
    try {
      const response = await api.get('/');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};

export default api;
