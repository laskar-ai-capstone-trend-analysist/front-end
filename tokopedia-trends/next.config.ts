import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.tokopedia.net',
        port: '',
        pathname: '/img/cache/**',
      },
    ],
  },
  eslint: {
    dirs: ['src'],
  },
};

export default nextConfig;
