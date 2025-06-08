// src/hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types';
import { productsApi } from '@/lib/api';
import { debug } from '@/lib/debug';
import { errorLogger } from '@/lib/errorLogger';
import { performanceMonitor } from '@/lib/performance';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    debug.componentMount('useProducts');
    performanceMonitor.monitorWebVitals();

    return () => {
      debug.componentUnmount('useProducts');
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    const operationName = 'fetchProducts';
    try {
      debug.info(`Starting ${operationName}`);
      performanceMonitor.start(operationName);

      setLoading(true);
      setError(null);

      const data = await productsApi.getAll();

      // ✅ Hapus products.length dari debug log untuk menghindari dependency issue
      debug.stateChange('products', 0, data.length);
      setProducts(data);

      const duration = performanceMonitor.end(operationName);
      debug.info(`${operationName} completed in ${duration?.toFixed(2)}ms`);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil data produk';

      errorLogger.logComponentError(
        'useProducts',
        `${operationName} failed`,
        err instanceof Error ? err : new Error(String(err))
      );
      setError(errorMessage);

      debug.error(`Error in ${operationName}:`, err);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Dependency array tetap kosong

  const searchProducts = useCallback(
    async (query: string) => {
      const operationName = 'searchProducts';

      if (!query.trim()) {
        debug.info(`${operationName}: Empty query, fetching all products`);
        await fetchProducts();
        return;
      }

      try {
        debug.info(`Starting ${operationName}`, { query });
        performanceMonitor.start(operationName, { query });

        setLoading(true);
        setError(null);

        const data = await productsApi.search(query);

        // ✅ Hapus products.length dari debug log
        debug.stateChange('products', 0, data.length);
        setProducts(data);

        const duration = performanceMonitor.end(operationName);
        debug.info(`${operationName} completed in ${duration?.toFixed(2)}ms`, {
          query,
          resultsCount: data.length,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mencari produk';

        errorLogger.logComponentError(
          'useProducts',
          `${operationName} failed`,
          err instanceof Error ? err : new Error(String(err))
        );
        setError(errorMessage);

        debug.error(`Error in ${operationName}:`, err);
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const filterByCategory = useCallback(async (categoryId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getByCategory(categoryId);
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memfilter produk'
      );
      console.error('Error in filterByCategory:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductById = useCallback(
    async (id: number): Promise<Product | null> => {
      try {
        const product = await productsApi.getById(id);
        return product;
      } catch (err) {
        console.error('Error in getProductById:', err);
        return null;
      }
    },
    []
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // ✅ Sekarang fetchProducts sudah di-memoize dengan useCallback

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    searchProducts,
    filterByCategory,
    getProductById,
  };
};
