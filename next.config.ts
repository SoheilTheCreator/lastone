import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use static export (generates plain HTML/CSS/JS files)
  output: 'export',
  
  // Disable image optimization (not needed for static export)
  images: {
    unoptimized: true,
  },
  
  // Optional: clean URLs (about.html vs about/index.html)
  trailingSlash: true,
  
  // Your existing settings
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;