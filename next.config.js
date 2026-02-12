/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use webpack instead of Turbopack for stability
  webpack: (config, { isServer }) => {
    // Optimize for memory usage
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
    };

    // Reduce memory usage
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  
  // Disable experimental features that cause issues
  experimental: {
    turbo: {
      resolveAlias: {
        // Disable turbopack aliases
      },
    },
  },
  
  // Optimize build
  swcMinify: true,
  
  // Reduce memory usage during development
  reactStrictMode: true,
  
  // Disable source maps in development to save memory
  webpackDevMiddleware: config => {
    config.writeToDisk = true;
    return config;
  },
};

module.exports = nextConfig;
