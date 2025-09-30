import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/serve-image/:path*',
      },
      // Legacy URLs previously used `/data/uploads/*` directly
      {
        source: '/data/uploads/:path*',
        destination: '/api/serve-image/:path*',
      },
    ];
  },
};

export default nextConfig;
