// src/components/product/ProductCard.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Package, Eye, ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn, formatCurrency } from '@/lib/utils';
import { Product } from '@/lib/types';
import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/useCategories';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  showRating?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  showRating = true,
  className,
}) => {
  const { getCategoryName } = useCategories();

  const hasDiscount = product.originalPrice > product.currentPrice;
  const isLowStock = product.stock < 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group bg-white rounded-2xl shadow-sm border border-gray-100',
        'hover:shadow-xl hover:border-blue-200 transition-all duration-300',
        'cursor-pointer overflow-hidden',
        className
      )}
      onClick={onClick}
    >
      {/* Product Image */}
      <div className='relative aspect-square overflow-hidden bg-gray-50'>
        <img
          src={product.imgUrl}
          alt={product.name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
        />

        {/* Badges */}
        <div className='absolute top-3 left-3 flex flex-col gap-2'>
          {hasDiscount && (
            <span className='px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md'>
              -{product.discount.toFixed(0)}%
            </span>
          )}
          {isLowStock && (
            <span className='px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-md'>
              Stok Terbatas
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className='absolute top-3 right-3'>
          <span className='px-2 py-1 bg-blue-500/90 text-white text-xs font-medium rounded-md backdrop-blur-sm'>
            {getCategoryName(product.categoryId)}
          </span>
        </div>

        {/* Quick View Button */}
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center'>
          <Button
            variant='outline'
            size='sm'
            className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm'
          >
            <Eye className='w-4 h-4 mr-2' />
            Lihat Detail
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className='p-4 space-y-3'>
        {/* Product Name */}
        <h3 className='font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors'>
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

          {hasDiscount && (
            <div className='text-xs text-green-600 font-medium'>
              Hemat{' '}
              {formatCurrency(product.originalPrice - product.currentPrice)}
            </div>
          )}
        </div>

        {/* Stock Info */}
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-1 text-gray-600'>
            <Package className='w-4 h-4' />
            <span>Stok: {product.stock}</span>
          </div>

          {/* Stock Status Indicator */}
          <div className='flex items-center gap-1'>
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                product.stock > 50
                  ? 'bg-green-500'
                  : product.stock > 10
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              )}
            />
            <span
              className={cn(
                'text-xs font-medium',
                product.stock > 50
                  ? 'text-green-600'
                  : product.stock > 10
                  ? 'text-yellow-600'
                  : 'text-red-600'
              )}
            >
              {product.stock > 50
                ? 'Tersedia'
                : product.stock > 10
                ? 'Terbatas'
                : 'Hampir Habis'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          className='w-full mt-4 group-hover:bg-blue-600 transition-colors'
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <ShoppingCart className='w-4 h-4 mr-2' />
          Lihat Produk
        </Button>
      </div>
    </motion.div>
  );
};
