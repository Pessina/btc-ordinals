import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ord.xverse.app",
        pathname: "/content/**",
      },
    ],
  },
};

export default nextConfig;
