'use client';

import React, { useState } from 'react';
import { ProductSearch } from '@/components/product/ProductSearch';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductModal } from '@/components/product/ProductModal';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useReviews } from '@/hooks/useReviews';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function Home() {
  const {
    products,
    loading,
    error,
    searchProducts,
    filterByCategory,
    refetch,
  } = useProducts();
  const { categories } = useCategories();
  const { reviews, fetchReviews } = useReviews();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      await searchProducts(query);
    } else {
      // Reset to all products if search is empty
      await refetch();
    }
  };

  const handleCategoryFilter = async (categoryId: number | null) => {
    if (categoryId) {
      await filterByCategory(categoryId);
    } else {
      // Reset to all products if no category selected
      await refetch();
    }
  };

  const handleViewDetails = async (product: Product) => {
    setSelectedProduct(product);
    await fetchReviews(product.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center'>
        <div className='max-w-md mx-auto text-center p-8'>
          <div className='w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-10 h-10 text-red-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Terjadi Kesalahan
          </h1>
          <p className='text-gray-600 mb-6'>{error}</p>
          <button
            onClick={() => refetch()}
            className={cn(
              'px-6 py-3 bg-blue-600 text-white rounded-lg font-medium',
              'hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100',
              'transition-all duration-200'
            )}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20'>
        {/* Header Section */}
        <Header productCount={products.length} />

        {/* Main Content */}
        <main className='relative'>
          {/* Search Section */}
          <section className='relative -mt-8 z-10'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <ProductSearch
                onSearch={handleSearch}
                onCategoryFilter={handleCategoryFilter}
                categories={categories}
                isLoading={loading}
                className='shadow-xl'
              />
            </div>
          </section>

          {/* Products Section */}
          <section className='py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='space-y-8'>
                {/* Section Header */}
                <div className='text-center'>
                  <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                    Produk Trending Terkini
                  </h2>
                  <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                    Temukan produk-produk pilihan yang sedang trending di
                    marketplace dengan performa terbaik dan rating tertinggi
                  </p>
                </div>

                {/* Products Grid */}
                <ProductGrid
                  products={products}
                  onViewDetails={handleViewDetails}
                  loading={loading}
                  error={error}
                  onRetry={refetch}
                />
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          {!loading && products.length > 0 && (
            <section className='py-16 bg-white/50 backdrop-blur-sm'>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
                  <div className='space-y-2'>
                    <div className='text-4xl font-bold text-blue-600'>
                      {products.length}+
                    </div>
                    <div className='text-gray-600'>Produk Tersedia</div>
                  </div>
                  <div className='space-y-2'>
                    <div className='text-4xl font-bold text-green-600'>
                      {categories.length}+
                    </div>
                    <div className='text-gray-600'>Kategori Beragam</div>
                  </div>
                  <div className='space-y-2'>
                    <div className='text-4xl font-bold text-purple-600'>
                      24/7
                    </div>
                    <div className='text-gray-600'>Update Real-time</div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <Footer />

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          reviews={reviews}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </ErrorBoundary>
  );
}
