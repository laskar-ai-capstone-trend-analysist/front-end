import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onViewDetails,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className='bg-white rounded-lg shadow-md overflow-hidden animate-pulse'
          >
            <div className='h-48 bg-gray-300'></div>
            <div className='p-4'>
              <div className='h-4 bg-gray-300 rounded mb-2'></div>
              <div className='h-4 bg-gray-300 rounded mb-2 w-3/4'></div>
              <div className='h-6 bg-gray-300 rounded mb-2 w-1/2'></div>
              <div className='h-4 bg-gray-300 rounded w-1/4'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='text-gray-500 text-lg'>
          Tidak ada produk yang ditemukan
        </div>
        <p className='text-gray-400 mt-2'>
          Coba ubah kata kunci pencarian atau filter kategori
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={onViewDetails}
          averageRating={4.5}
          reviewCount={120}
        />
      ))}
    </div>
  );
};
