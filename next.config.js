// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export - THIS IS CRUCIAL
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Handle trailing slashes (optional)
  trailingSlash: true,
  
  // Configure asset prefix if deploying to a subdirectory (uncomment if needed)
  // assetPrefix: '/my-app',
  
  // Configure base path if deploying to a subdirectory (uncomment if needed)
  // basePath: '/my-app',
  
  // Ensure compatibility with static export
  experimental: {
    esmExternals: false,
  },
  
  // Disable server-side features that don't work with static export
  swcMinify: true,
}

module.exports = nextConfig