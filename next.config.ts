import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 100],
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
