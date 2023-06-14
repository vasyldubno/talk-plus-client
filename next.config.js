/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
  images: {
    loader: 'default',
    domains: ['res.cloudinary.com']
  }
}

module.exports = nextConfig
 