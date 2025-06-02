// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { productsApi } from '@/lib/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.search(query);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getByCategory(categoryId);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    searchProducts,
    filterByCategory,
  };
};
