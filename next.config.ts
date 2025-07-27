import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost','placehold.co'], // Add 'localhost' here or any other domains you want to allow
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Allows any path from this hostname
      },
    ],
  },
};

export default nextConfig;
