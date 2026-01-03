const isProd = process.env.NODE_ENV === 'production'
const backendApiProxyTarget =
  process.env.BACKEND_API_PROXY_TARGET ||
  (isProd ? process.env.BACKEND_API_PROXY_TARGET_PROD : process.env.BACKEND_API_PROXY_TARGET_DEV)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', '150.158.153.243']
  },
  async rewrites() {
    // 代理外部后端 API (AI 生成、搜索等功能)
    if (!backendApiProxyTarget) return []

    const normalizedTarget = backendApiProxyTarget.replace(/\/$/, '')
    return [
      {
        source: '/backend-api/:path*',
        destination: `${normalizedTarget}/api/:path*`
      }
    ]
  }
}

export default nextConfig
