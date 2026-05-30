import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CRITICAL: Enables standalone output for Runflare/Cloudflare
  output: 'standalone',
  
  // Ensures static assets (CSS, images) are handled correctly
  distDir: '.next',
  
  // Disables Next.js image optimization (not supported on Runflare)
  images: {
    unoptimized: true,
  },
  
  
  // Prevents build failures from TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimizes trailing slashes for static hosting
  trailingSlash: false,
  
  
  // Ensures proper asset prefixing (leave empty for relative paths)
  assetPrefix: '',
  
  // Enables cross-origin isolation if needed
  crossOrigin: 'anonymous',
};

export default nextConfig;