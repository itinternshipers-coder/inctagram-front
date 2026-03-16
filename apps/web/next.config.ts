import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@inctagram/ui'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://gateway.traineegramm.ru/api/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.yandexcloud.net',
        port: '',
        pathname: '/traineegramm/**',
      },
    ],
  },
}

export default nextConfig
