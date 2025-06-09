'use client';

import React, { useState } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductSearch } from '@/components/product/ProductSearch';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductModal } from '@/components/product/ProductModal';
import { Button } from '@/components/ui/Button';
import { RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types';

// Import custom hooks
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use custom hooks for API integration
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
    searchProducts,
    filterByCategory,
  } = useProducts();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Combined loading state
  const loading = productsLoading || categoriesLoading;

  // Combined error state
  const error = productsError || categoriesError;

  // Handlers
  const handleSearch = async (query: string) => {
    try {
      await searchProducts(query);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleCategoryFilter = async (categoryId: number | null) => {
    try {
      if (categoryId === null) {
        await refetchProducts();
      } else {
        await filterByCategory(categoryId);
      }
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleRetry = () => {
    refetchProducts();
  };

  // Error State dengan informasi lebih detail
  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center'>
        <div className='max-w-md mx-auto text-center p-8'>
          <AlertCircle className='w-16 h-16 mx-auto mb-6 text-red-500' />
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Tidak Dapat Memuat Data
          </h1>
          <p className='text-gray-600 mb-4'>{error}</p>
          <div className='text-sm text-gray-500 mb-6 bg-gray-100 p-3 rounded'>
            <strong>Troubleshooting:</strong>
            <br />• Pastikan backend berjalan di port 5000
            <br />• Cek file .env.local
            <br />• Periksa console untuk error detail
          </div>
          <button
            onClick={handleRetry}
            className={cn(
              'px-6 py-3 bg-blue-600 text-white rounded-lg font-medium',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200'
            )}
            disabled={loading}
          >
            <RefreshCw
              className={cn('w-4 h-4 mr-2 inline', loading && 'animate-spin')}
            />
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
                  onRetry={handleRetry}
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
                    <div className='text-gray-600'>Analisis Real-time</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Features Section */}
          {!loading && (
            <section className='py-16 bg-gradient-to-r from-blue-50 to-purple-50'>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-12'>
                  <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                    Fitur Unggulan
                  </h2>
                  <p className='text-lg text-gray-600'>
                    Platform analisis tren produk terlengkap dengan teknologi AI
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                  <div className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow'>
                    <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4'>
                      <TrendingUp className='w-6 h-6 text-blue-600' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                      Analisis Sentimen AI
                    </h3>
                    <p className='text-gray-600'>
                      Dapatkan insights mendalam tentang sentimen pelanggan
                      menggunakan teknologi AI sentiment analysis terdepan.
                    </p>
                  </div>

                  <div className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow'>
                    <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4'>
                      <RefreshCw className='w-6 h-6 text-green-600' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                      Data Real-time
                    </h3>
                    <p className='text-gray-600'>
                      Akses data produk dan review terbaru secara real-time
                      langsung dari marketplace Tokopedia.
                    </p>
                  </div>

                  <div className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow'>
                    <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4'>
                      <AlertCircle className='w-6 h-6 text-purple-600' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                      Filter Cerdas
                    </h3>
                    <p className='text-gray-600'>
                      Temukan produk yang tepat dengan sistem filter
                      multi-kategori dan pencarian yang cerdas.
                    </p>
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
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </ErrorBoundary>
  );
}
