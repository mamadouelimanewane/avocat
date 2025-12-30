/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Configuration pour @react-pdf/renderer
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
        encoding: false,
      }
    }
    
    return config
  },
  // Transpile les packages ESM
  transpilePackages: ['@react-pdf/renderer'],
  
  // Options supplémentaires recommandées
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
