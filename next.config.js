/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['hume', '@humeai/voice-react'],
  // Ensure Markdown sources are included in the serverless function bundle on Vercel.
  // In Next 14 this option lives under `experimental`; a top-level key is ignored.
  experimental: {
    outputFileTracingIncludes: {
      '/api/knowledge-search': ['./knowledge/**/*'],
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };

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
};

module.exports = nextConfig;
