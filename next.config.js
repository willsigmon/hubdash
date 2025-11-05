/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    KNACK_APP_ID: process.env.KNACK_APP_ID,
    KNACK_API_KEY: process.env.KNACK_API_KEY,
  },
}

module.exports = nextConfig
