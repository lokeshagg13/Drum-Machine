/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: "mongodb://localhost:27017/DrumMachine",
  },
  reactStrictMode: true,
}

module.exports = nextConfig
