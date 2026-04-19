import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'brainypulse.com' }],
        destination: 'https://www.brainypulse.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.brainypulse.com' }],
        missing: [{ type: 'header', key: 'x-forwarded-proto', value: 'https' }],
        destination: 'https://www.brainypulse.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
