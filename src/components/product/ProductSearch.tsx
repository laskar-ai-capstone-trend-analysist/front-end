// src/components/product/ProductSearch.tsx
import React, { useState, useCallback } from 'react';
import { Filter, RotateCcw, TrendingUp } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { FilterBadge } from '@/components/ui/FilterBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (categoryId: number | null) => void;
  categories: Category[];
  isLoading?: boolean;
  className?: string;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  onCategoryFilter,
  categories,
  isLoading = false,
  className,
}) => {
  const [activeFilters, setActiveFilters] = useState<{
    search: string;
    category: number | null;
  }>({
    search: '',
    category: null,
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(
    (query: string) => {
      setActiveFilters((prev) => ({ ...prev, search: query }));
      onSearch(query);
    },
    [onSearch]
  );

  const handleCategoryChange = useCallback(
    (categoryId: string | number) => {
      const numericId = categoryId === 'all' ? null : Number(categoryId);
      setActiveFilters((prev) => ({ ...prev, category: numericId }));
      onCategoryFilter(numericId);
    },
    [onCategoryFilter]
  );

  const handleClearSearch = () => {
    setActiveFilters((prev) => ({ ...prev, search: '' }));
    onSearch('');
  };

  const handleClearCategory = () => {
    setActiveFilters((prev) => ({ ...prev, category: null }));
    onCategoryFilter(null);
  };

  const handleClearAll = () => {
    setActiveFilters({ search: '', category: null });
    onSearch('');
    onCategoryFilter(null);
  };

  const categoryOptions = [
    { value: 'all', label: 'Semua Kategori' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const selectedCategory = categories.find(
    (cat) => cat.id === activeFilters.category
  );
  const hasActiveFilters = activeFilters.search || activeFilters.category;

  return (
    <Card className={cn('p-6 space-y-6', className)}>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-blue-100 rounded-lg'>
            <TrendingUp className='w-5 h-5 text-blue-600' />
          </div>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Cari & Filter Produk
            </h2>
            <p className='text-sm text-gray-500'>
              Temukan produk trending yang Anda cari
            </p>
          </div>
        </div>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => setShowFilters(!showFilters)}
          className='lg:hidden'
        >
          <Filter className='w-4 h-4' />
          Filter
        </Button>
      </div>

      {/* Search Input */}
      <div className='space-y-4'>
        <SearchInput
          placeholder='Cari produk berdasarkan nama...'
          onSearch={handleSearch}
          isLoading={isLoading}
          debounceMs={400}
        />

        {/* Filters Section */}
        <div
          className={cn(
            'space-y-4 transition-all duration-300',
            showFilters ? 'block' : 'hidden lg:block'
          )}
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {/* Category Filter */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Kategori
              </label>
              <Select
                options={categoryOptions}
                value={activeFilters.category || 'all'}
                onChange={handleCategoryChange}
                placeholder='Pilih kategori...'
                disabled={isLoading}
              />
            </div>

            {/* Additional filters can be added here */}
            <div className='flex items-end'>
              <Button
                variant='outline'
                onClick={handleClearAll}
                disabled={!hasActiveFilters || isLoading}
                className='w-full lg:w-auto'
                leftIcon={<RotateCcw className='w-4 h-4' />}
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className='space-y-3'>
            <div className='text-sm font-medium text-gray-700'>
              Filter Aktif:
            </div>
            <div className='flex flex-wrap gap-2'>
              {activeFilters.search && (
                <FilterBadge
                  label={`Pencarian: "${activeFilters.search}"`}
                  onRemove={handleClearSearch}
                  variant='search'
                />
              )}
              {selectedCategory && (
                <FilterBadge
                  label={`Kategori: ${selectedCategory.name}`}
                  onRemove={handleClearCategory}
                  variant='category'
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats or Tips */}
      <div className='pt-4 border-t border-gray-100'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-center'>
          <div className='space-y-1'>
            <div className='text-lg font-semibold text-blue-600'>
              {categories.length}+
            </div>
            <div className='text-xs text-gray-500'>Kategori</div>
          </div>
          <div className='space-y-1'>
            <div className='text-lg font-semibold text-green-600'>
              Real-time
            </div>
            <div className='text-xs text-gray-500'>Data Update</div>
          </div>
          <div className='space-y-1'>
            <div className='text-lg font-semibold text-purple-600'>Smart</div>
            <div className='text-xs text-gray-500'>Search</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
