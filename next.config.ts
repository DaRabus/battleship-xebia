import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Changed from 'standalone' to 'export' for static site generation
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  // Configure base path if deploying to a subdirectory (e.g. GitHub Pages)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  // Make sure we use correct asset prefixes for GitHub Pages
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  // Disable image optimization since it's not supported with export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '*',
      },
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
};

export default nextConfig;
