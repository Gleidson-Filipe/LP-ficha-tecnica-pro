import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 82, 90],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pandavideo.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
