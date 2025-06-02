import { useState } from 'react';
import { Review } from '@/lib/types';
import { reviewsApi } from '@/lib/api';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewsApi.getByProductId(productId);
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const clearReviews = () => {
    setReviews([]);
    setError(null);
  };

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    clearReviews,
  };
};
