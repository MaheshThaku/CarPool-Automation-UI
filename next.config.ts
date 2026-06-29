import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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