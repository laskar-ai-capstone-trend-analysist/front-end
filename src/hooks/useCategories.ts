// src/hooks/useCategories.ts
import { useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import { categoriesApi } from '@/lib/api';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil kategori'
      );
      console.error('Error in fetchCategories:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = (id: number): Category | undefined => {
    return categories.find((category) => category.id === id);
  };

  const getCategoryName = (id: number): string => {
    const category = getCategoryById(id);
    return category ? category.name : 'Kategori Tidak Diketahui';
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    getCategoryById,
    getCategoryName,
  };
};
