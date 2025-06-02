// src/components/product/ProductSearch.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Category } from '@/lib/types';
import { Search, Filter } from 'lucide-react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (categoryId: number | null) => void;
  categories: Category[];
  isLoading?: boolean;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  onCategoryFilter,
  categories,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryFilter(categoryId ? parseInt(categoryId) : null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    onSearch('');
    onCategoryFilter(null);
  };

  return (
    <Card>
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
          <Search className='w-5 h-5' />
          Cari Produk
        </h2>

        <form onSubmit={handleSearch} className='space-y-4'>
          {/* Search Input */}
          <Input
            type='text'
            placeholder='Cari produk berdasarkan nama...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className='w-5 h-5 text-gray-400' />}
          />

          {/* Category Filter */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Filter Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className='block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              >
                <option value=''>Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex items-end gap-2'>
              <Button type='submit' disabled={isLoading} className='flex-1'>
                {isLoading ? 'Mencari...' : 'Cari'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={resetFilters}
                disabled={isLoading}
              >
                <Filter className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
};
