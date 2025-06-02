// src/components/ui/SearchInput.tsx
import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  isLoading?: boolean;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Cari produk...',
  onSearch,
  debounceMs = 300,
  isLoading = false,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className={cn('relative group', className)}>
      <div className='relative'>
        {/* Search Icon */}
        <div className='absolute left-4 top-1/2 transform -translate-y-1/2'>
          {isLoading ? (
            <Loader2 className='w-5 h-5 text-blue-500 animate-spin' />
          ) : (
            <Search className='w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors' />
          )}
        </div>

        {/* Input Field */}
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-12 pr-12 py-4 rounded-2xl',
            'border-2 border-gray-200 bg-white',
            'text-gray-900 placeholder-gray-500',
            'focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100',
            'transition-all duration-200',
            'shadow-sm hover:shadow-md focus:shadow-lg',
            isLoading && 'cursor-wait'
          )}
          disabled={isLoading}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-4 top-1/2 transform -translate-y-1/2',
              'p-1 rounded-full hover:bg-gray-100',
              'text-gray-400 hover:text-gray-600',
              'transition-all duration-200'
            )}
            disabled={isLoading}
          >
            <X className='w-4 h-4' />
          </button>
        )}
      </div>

      {/* Search Indicator */}
      {query && (
        <div className='absolute top-full left-0 right-0 mt-2'>
          <div className='text-xs text-gray-500 px-4'>
            {isLoading ? (
              <span className='flex items-center gap-1'>
                <Loader2 className='w-3 h-3 animate-spin' />
                {`Mencari "${query}"...`}
              </span>
            ) : (
              <span>{`Menampilkan hasil untuk "${debouncedQuery}"`}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
