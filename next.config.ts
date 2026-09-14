import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 1. External Images Configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", //change this to cloudflare host for our images
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
