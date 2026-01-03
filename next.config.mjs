/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', '150.158.153.243']
  },
  async rewrites() {
    // 禁用 rewrites，使用 API Route 代理（支持流式响应）
    // 所有 /backend-api/* 请求由 src/app/backend-api/[...path]/route.js 处理
    return []
  }
}

export default nextConfig
