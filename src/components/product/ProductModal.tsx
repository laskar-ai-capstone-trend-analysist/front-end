import React, { useEffect } from 'react';
import Image from 'next/image';
import { Product, Review } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { X, Star, Package, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useReviews } from '@/hooks/useReviews';
import { useCategories } from '@/hooks/useCategories';
import { useSentiment } from '@/hooks/useSentiment';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { reviews, fetchReviews, getAverageRating } = useReviews();
  const { categories, getCategoryName } = useCategories();
  const {
    sentimentData,
    fetchSentimentByProduct,
    getSentimentSummary,
    getSentimentColor,
    getSentimentLabel,
    loading: sentimentLoading,
  } = useSentiment();

  useEffect(() => {
    if (product && isOpen) {
      fetchReviews(product.id);
      fetchSentimentByProduct(product.id);
    }
  }, [product, isOpen, fetchReviews, fetchSentimentByProduct]);

  if (!product) return null;

  const averageRating = getAverageRating();
  const hasDiscount = product.originalPrice > product.currentPrice;
  const sentimentSummary = getSentimentSummary(product.id);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto',
          'transform transition-all duration-300',
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-6'>
          {/* Header */}
          <div className='flex items-start justify-between mb-6'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-2'>
                <span className='px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full'>
                  {getCategoryName(product.categoryId)}
                </span>
                {hasDiscount && (
                  <span className='px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full'>
                    -{product.discount.toFixed(0)}%
                  </span>
                )}
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-4 leading-tight'>
                {product.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-gray-100 rounded-full transition-colors'
            >
              <X className='w-6 h-6 text-gray-500' />
            </button>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Product Image */}
            <div className='space-y-4'>
              <div className='aspect-square bg-gray-100 rounded-2xl overflow-hidden'>
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                />
              </div>
            </div>

            {/* Product Details */}
            <div className='space-y-6'>
              {/* Rating */}
              {reviews.length > 0 && (
                <div className='flex items-center gap-2'>
                  <div className='flex items-center'>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${
                          index < Math.floor(averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-lg font-semibold text-gray-900'>
                    {averageRating.toFixed(1)} ({reviews.length} ulasan)
                  </span>
                </div>
              )}

              {/* Sentiment Analysis */}
              {sentimentSummary.total > 0 && (
                <div className='bg-gray-50 rounded-xl p-4 space-y-3'>
                  <h4 className='font-semibold text-gray-900 flex items-center gap-2'>
                    <TrendingUp className='w-5 h-5 text-blue-600' />
                    Analisis Sentimen Review
                  </h4>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>
                        Sentimen Dominan:
                      </span>
                      <span
                        className={cn(
                          'font-semibold',
                          getSentimentColor(product.id)
                        )}
                      >
                        {getSentimentLabel(product.id)}
                      </span>
                    </div>

                    {/* Sentiment Distribution */}
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-green-600'>Positif</span>
                        <span className='font-medium'>
                          {sentimentSummary.positivePercentage}%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-green-500 h-2 rounded-full'
                          style={{
                            width: `${sentimentSummary.positivePercentage}%`,
                          }}
                        />
                      </div>

                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-600'>Netral</span>
                        <span className='font-medium'>
                          {sentimentSummary.neutralPercentage}%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-gray-400 h-2 rounded-full'
                          style={{
                            width: `${sentimentSummary.neutralPercentage}%`,
                          }}
                        />
                      </div>

                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-red-600'>Negatif</span>
                        <span className='font-medium'>
                          {sentimentSummary.negativePercentage}%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-red-500 h-2 rounded-full'
                          style={{
                            width: `${sentimentSummary.negativePercentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {sentimentLoading && (
                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      Menganalisis sentimen...
                    </div>
                  )}
                </div>
              )}

              {/* Price */}
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-3xl font-bold text-green-600'>
                  {formatCurrency(product.currentPrice)}
                </span>
                {hasDiscount && (
                  <span className='text-xl text-gray-500 line-through'>
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className='flex items-center gap-2 mb-6'>
                <Package className='w-5 h-5 text-gray-500' />
                <span className='text-gray-600'>
                  Stok tersedia:{' '}
                  <span className='font-semibold'>{product.stock}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3'>
                <Button className='flex-1'>Lihat di Tokopedia</Button>
                <Button variant='outline' onClick={onClose}>
                  Tutup
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className='mt-8 border-t border-gray-200 pt-8'>
              <h3 className='text-lg font-semibold mb-6'>
                Ulasan Pelanggan ({reviews.length})
              </h3>
              <div className='space-y-4 max-h-60 overflow-y-auto'>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className='border-b border-gray-100 pb-4 last:border-b-0'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        <div className='flex items-center'>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${
                                index < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className='text-sm font-medium'>
                          {review.rating}/5
                        </span>
                      </div>
                      <div className='flex items-center gap-1 text-sm text-gray-500'>
                        <Calendar className='w-4 h-4' />
                        {formatDate(review.tanggal)}
                      </div>
                    </div>
                    <p className='text-gray-700 text-sm leading-relaxed'>
                      {review.review}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
