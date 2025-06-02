// src/components/product/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  averageRating?: number;
  reviewCount?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  averageRating = 0,
  reviewCount = 0,
}) => {
  const discountPercentage = product.discount || 0;
  const hasDiscount = discountPercentage > 0;

  return (
    <Card
      padding='none'
      className='overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group'
    >
      <div onClick={() => onViewDetails(product)}>
        {/* Product Image */}
        <div className='relative h-48 overflow-hidden'>
          <Image
            src={product.imgUrl}
            alt={product.name}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
          {hasDiscount && (
            <div className='absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold'>
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className='p-4'>
          <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>
            {product.name}
          </h3>

          {/* Rating */}
          {averageRating > 0 && (
            <div className='flex items-center gap-1 mb-2'>
              <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
              <span className='text-sm text-gray-600'>
                {averageRating.toFixed(1)} ({reviewCount} ulasan)
              </span>
            </div>
          )}

          {/* Price */}
          <div className='flex items-center gap-2 mb-3'>
            <span className='text-xl font-bold text-green-600'>
              {formatCurrency(product.currentPrice)}
            </span>
            {hasDiscount && (
              <span className='text-sm text-gray-500 line-through'>
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock and Action */}
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>Stok: {product.stock}</span>
            <Button
              size='sm'
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className='flex items-center gap-1'
            >
              <ShoppingCart className='w-4 h-4' />
              Detail
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
