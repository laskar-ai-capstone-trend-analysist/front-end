import React from 'react';
import Image from 'next/image';
import { Product, Review } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { X, Star, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductModalProps {
  product: Product | null;
  reviews: Review[];
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  reviews,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const hasDiscount = product.discount > 0;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden'>
        {/* Modal Header */}
        <div className='flex justify-between items-center p-6 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-900'>Detail Produk</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Modal Content */}
        <div className='overflow-y-auto max-h-[calc(90vh-80px)]'>
          <div className='p-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Product Image */}
              <div className='space-y-4'>
                <div className='relative aspect-square rounded-lg overflow-hidden'>
                  <Image
                    src={product.imgUrl}
                    alt={product.name}
                    fill
                    className='object-cover'
                    sizes='(max-width: 1024px) 100vw, 50vw'
                  />
                  {hasDiscount && (
                    <div className='absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className='space-y-6'>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900 mb-4'>
                    {product.name}
                  </h1>

                  {/* Rating */}
                  {averageRating > 0 && (
                    <div className='flex items-center gap-2 mb-4'>
                      <div className='flex items-center'>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`w-5 h-5 ${
                              index < Math.round(averageRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-sm text-gray-600'>
                        {averageRating.toFixed(1)} ({reviews.length} ulasan)
                      </span>
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
    </div>
  );
};
