/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    root: process.cwd(),
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
