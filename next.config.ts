// next.config.js

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://gateway.traineegramm.ru/api/:path*',
      },
    ]
  },
}

export default nextConfig
