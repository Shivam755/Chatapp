import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",                // any request starting with /api
        destination: "http://localhost:4000/:path*", // your Express API
      },
    ];
  },
};

export default nextConfig;
