// src/components/product/ProductCard.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Package, Eye, ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn, formatCurrency } from '@/lib/utils';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties; // Tambahkan ini
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  className,
  priority = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasDiscount =
    product.originalPrice > 0 && product.originalPrice > product.currentPrice;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.currentPrice) /
          product.originalPrice) *
          100
      )
    : 0;

  const stockStatus =
    product.stock > 100 ? 'high' : product.stock > 10 ? 'medium' : 'low';
  const stockColor = {
    high: 'text-green-600',
    medium: 'text-yellow-600',
    low: 'text-red-600',
  };

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-2 cursor-pointer',
        'border-gray-200 hover:border-blue-300',
        className
      )}
      padding='none'
      onClick={() => onViewDetails(product)}
    >
      {/* Image Container */}
      <div className='relative overflow-hidden'>
        {/* Discount Badge */}
        {hasDiscount && (
          <div className='absolute top-3 left-3 z-10'>
            <div className='bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1'>
              <Zap className='w-3 h-3' />-{discountPercentage}%
            </div>
          </div>
        )}

        {/* Stock Badge */}
        <div className='absolute top-3 right-3 z-10'>
          <div
            className={cn(
              'bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1',
              stockColor[stockStatus]
            )}
          >
            <Package className='w-3 h-3' />
            {product.stock}
          </div>
        </div>

        {/* Image with Next.js Image component */}
        <div className='relative w-full h-64 bg-gray-100'>
          {!imageError ? (
            <>
              {!imageLoaded && (
                <div className='absolute inset-0 bg-gray-200 animate-pulse rounded-t-xl' />
              )}
              <Image
                src={product.imgUrl}
                alt={product.name}
                fill
                className={cn(
                  'object-cover transition-all duration-500',
                  'group-hover:scale-110',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                priority={priority}
                onLoad={handleImageLoad}
                onError={handleImageError}
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              />
            </>
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gray-100 text-gray-400'>
              <Package className='w-12 h-12' />
            </div>
          )}

          {/* Overlay on Hover */}
          <div
            className={cn(
              'absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100',
              'transition-opacity duration-300 flex items-center justify-center'
            )}
          >
            <div className='transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
              <Button
                variant='secondary'
                size='sm'
                leftIcon={<Eye className='w-4 h-4' />}
                className='bg-white/90 text-gray-900 hover:bg-white'
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(product);
                }}
              >
                Lihat Detail
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4 space-y-3'>
        {/* Product Name */}
        <h3 className='font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors'>
          {product.name}
        </h3>

        {/* Price Section */}
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <span className='text-lg font-bold text-green-600'>
              {formatCurrency(product.currentPrice)}
            </span>
            {hasDiscount && (
              <span className='text-sm text-gray-500 line-through'>
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Info */}
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-1'>
            <Package className='w-4 h-4 text-gray-400' />
            <span className='text-gray-600'>
              Stok:{' '}
              <span className={cn('font-medium', stockColor[stockStatus])}>
                {product.stock}
              </span>
            </span>
          </div>

          {/* Rating Placeholder */}
          <div className='flex items-center gap-1'>
            <Star className='w-4 h-4 text-yellow-400 fill-current' />
            <span className='text-gray-600'>
              4.{Math.floor(Math.random() * 10)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant='primary'
          size='sm'
          className='w-full group-hover:shadow-lg transition-shadow'
          leftIcon={<ShoppingCart className='w-4 h-4' />}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
        >
          Lihat Produk
        </Button>
      </div>

      {/* Trending Indicator */}
      {Math.random() > 0.7 && (
        <div className='absolute bottom-4 right-4'>
          <div className='bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse'>
            🔥 Trending
          </div>
        </div>
      )}
    </Card>
  );
};
