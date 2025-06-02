import React from 'react';
import { AlertCircle, Package, RefreshCw } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onViewDetails,
  loading = false,
  error = null,
  onRetry,
  className,
}) => {
  // Loading State
  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className='flex items-center justify-center py-8'>
          <div className='flex items-center gap-3 text-blue-600'>
            <RefreshCw className='w-6 h-6 animate-spin' />
            <span className='text-lg font-medium'>Memuat produk...</span>
          </div>
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <AlertCircle className='w-16 h-16 text-red-500 mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Terjadi Kesalahan
          </h3>
          <p className='text-gray-600 mb-6 max-w-md'>{error}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              leftIcon={<RefreshCw className='w-4 h-4' />}
              variant='outline'
            >
              Coba Lagi
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <Package className='w-16 h-16 text-gray-400 mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Tidak Ada Produk
          </h3>
          <p className='text-gray-600 max-w-md'>
            Tidak ditemukan produk yang sesuai dengan pencarian Anda. Coba ubah
            kata kunci atau filter yang digunakan.
          </p>
        </div>
      </div>
    );
  }

  // Success State with Products
  return (
    <div className={cn('space-y-6', className)}>
      {/* Results Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h2 className='text-xl font-bold text-gray-900'>Produk Ditemukan</h2>
          <div className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
            {products.length} items
          </div>
        </div>

        {/* Sort Options Placeholder */}
        <div className='text-sm text-gray-500'>
          Menampilkan produk terpopuler
        </div>
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onViewDetails}
            priority={index < 4} // Prioritize first 4 images for loading
            className='animate-fade-in-up'
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>

      {/* Load More Placeholder */}
      {products.length >= 8 && (
        <div className='flex justify-center pt-8'>
          <Button
            variant='outline'
            size='lg'
            className='px-8'
            onClick={() => {
              // Placeholder for load more functionality
              console.log('Load more products...');
            }}
          >
            Muat Lebih Banyak
          </Button>
        </div>
      )}
    </div>
  );
};
