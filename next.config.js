/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js configuration for Vercel deployment
  reactStrictMode: true,
  

  
  // Disable image optimization for external domains to avoid issues
  images: {
    unoptimized: true,
  },
  
  // Environment variables - ensure they're properly exposed
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    // Cache busting parameter
    NEXT_PUBLIC_BUILD_TIME: Date.now().toString(),
  },
  
  // Build configuration
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },

  // Ensure environment variables are available at runtime
  experimental: {
    // This ensures environment variables are properly injected
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
}

module.exports = nextConfig
