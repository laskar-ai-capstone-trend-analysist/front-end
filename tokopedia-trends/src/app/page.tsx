'use client';

import React, { useState } from 'react';
import { ProductSearch } from '@/components/product/ProductSearch';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductModal } from '@/components/product/ProductModal';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useReviews } from '@/hooks/useReviews';
import { Product } from '@/lib/types';
import { TrendingUp, Package } from 'lucide-react';

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
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center py-12'>
            <div className='text-red-500 text-lg font-semibold'>
              Terjadi Kesalahan
            </div>
            <p className='text-gray-600 mt-2'>{error}</p>
            <button
              onClick={() => refetch()}
              className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg'>
                  <TrendingUp className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h1 className='text-xl font-bold text-gray-900'>
                    Tokopedia Trends
                  </h1>
                  <p className='text-sm text-gray-500'>
                    Analisis Tren Produk Marketplace
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className='hidden md:flex items-center gap-6'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Package className='w-4 h-4' />
                <span>{products.length} Produk</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='space-y-8'>
          {/* Search and Filter Section */}
          <ProductSearch
            onSearch={handleSearch}
            onCategoryFilter={handleCategoryFilter}
            categories={categories}
            isLoading={loading}
          />

          {/* Products Grid */}
          <div>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Produk Trending
              </h2>
              <div className='text-sm text-gray-500'>
                {products.length} produk ditemukan
              </div>
            </div>

            <ProductGrid
              products={products}
              onViewDetails={handleViewDetails}
              loading={loading}
            />
          </div>
        </div>
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        reviews={reviews}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
