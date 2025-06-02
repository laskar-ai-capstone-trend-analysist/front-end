// src/components/layout/Header.tsx
import React from 'react';
import { TrendingUp, Package, Activity, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  productCount: number;
  className?: string;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({
  icon,
  label,
  value,
  delay = 0,
}) => (
  <div
    className={cn(
      'flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm',
      'rounded-xl border border-white/20 shadow-lg',
      'hover:bg-white/20 transition-all duration-300',
      'animate-fade-in-up'
    )}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className='p-2 bg-white/20 rounded-lg'>{icon}</div>
    <div>
      <div className='text-white/90 text-sm font-medium'>{label}</div>
      <div className='text-white text-lg font-bold'>{value}</div>
    </div>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ productCount, className }) => {
  return (
    <header
      className={cn(
        'relative overflow-hidden',
        'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800',
        'border-b border-blue-500/20',
        className
      )}
    >
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-48 -translate-y-48' />
        <div className='absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-48 translate-y-48' />
      </div>

      {/* Animated Floating Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-float' />
        <div className='absolute top-3/4 right-1/4 w-6 h-6 bg-white/15 rounded-full animate-float-delayed' />
        <div className='absolute top-1/2 right-1/3 w-3 h-3 bg-white/25 rounded-full animate-float-slow' />
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='py-8 lg:py-12'>
          {/* Main Title Section */}
          <div className='text-center mb-8'>
            <div className='flex items-center justify-center gap-4 mb-4'>
              <div
                className={cn(
                  'flex items-center justify-center w-16 h-16',
                  'bg-white/20 backdrop-blur-sm rounded-2xl',
                  'border border-white/30 shadow-2xl',
                  'animate-bounce-gentle'
                )}
              >
                <TrendingUp className='w-8 h-8 text-white' />
              </div>
              <div className='text-left'>
                <h1
                  className={cn(
                    'text-4xl lg:text-5xl font-bold text-white',
                    'animate-fade-in-up'
                  )}
                >
                  Tokopedia Trends
                </h1>
                <p
                  className={cn(
                    'text-blue-100 text-lg mt-2',
                    'animate-fade-in-up'
                  )}
                  style={{ animationDelay: '200ms' }}
                >
                  Analisis Tren Produk Marketplace
                </p>
              </div>
            </div>

            {/* Subtitle */}
            <p
              className={cn(
                'text-blue-50/90 text-lg max-w-2xl mx-auto leading-relaxed',
                'animate-fade-in-up'
              )}
              style={{ animationDelay: '400ms' }}
            >
              Temukan produk trending, analisis performa, dan dapatkan insights
              mendalam tentang tren marketplace terkini
            </p>
          </div>

          {/* Stats Section */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6'>
            <StatItem
              icon={<Package className='w-5 h-5 text-white' />}
              label='Total Produk'
              value={productCount.toLocaleString('id-ID')}
              delay={600}
            />
            <StatItem
              icon={<Activity className='w-5 h-5 text-white' />}
              label='Kategori Aktif'
              value='12+'
              delay={800}
            />
            <StatItem
              icon={<Users className='w-5 h-5 text-white' />}
              label='Data Real-time'
              value='Live'
              delay={1000}
            />
          </div>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className='absolute bottom-0 left-0 right-0'>
        <svg
          className='w-full h-6 text-gray-50'
          preserveAspectRatio='none'
          viewBox='0 0 1440 54'
          fill='currentColor'
        >
          <path d='M0,22 C120,36 240,36 360,22 C480,8 600,8 720,22 C840,36 960,36 1080,22 C1200,8 1320,8 1440,22 L1440,54 L0,54 Z' />
        </svg>
      </div>
    </header>
  );
};
