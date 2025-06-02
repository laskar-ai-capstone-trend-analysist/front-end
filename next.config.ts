import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remove experimental.turbo configuration as it's now stable
  // experimental: {
  //   turbo: {} // This is deprecated
  // },

  // Standard Next.js configurations
  typescript: {
    // Type checking during build
    ignoreBuildErrors: false,
  },

  eslint: {
    // ESLint during build
    ignoreDuringBuilds: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.tokopedia.net',
        port: '',
        pathname: '/img/**',
      },
    ],
  },

  // Other configurations can go here
};

export default nextConfig;
