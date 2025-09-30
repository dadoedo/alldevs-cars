import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/serve-image/:path*',
      },
    ];
  },
};

export default nextConfig;
