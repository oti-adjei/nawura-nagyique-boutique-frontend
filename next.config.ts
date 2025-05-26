import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost','placehold.co'], // Add 'localhost' here or any other domains you want to allow
  },
};

export default nextConfig;
