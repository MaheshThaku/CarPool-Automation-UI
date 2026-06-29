import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'sharefare-documents-storage.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
