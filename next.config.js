/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* config options here */
  images: {
    domains: ['localhost','placehold.co', 'exquisite-courage-development.up.railway.app','lh3.googleusercontent.com'], // Add 'localhost' here or any other domains you want to allow
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

module.exports = nextConfig
