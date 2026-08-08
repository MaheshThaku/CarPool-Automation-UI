import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.8', 'localhost:3000', '127.0.0.1:3000'],
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'sharefare-documents-storage.s3.ap-south-1.amazonaws.com',
      },

      {
        protocol: 'https',
        hostname:
          'sharefare-bucket.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;