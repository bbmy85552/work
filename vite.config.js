import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiEnv = (env.VITE_API_ENV || 'development').toLowerCase()
  const proxyTargets = {
    development: 'http://localhost:8000',
    production: 'http://150.158.153.243:8000',
  }
  // 允许 VITE_API_PROXY_TARGET 手动覆盖，默认根据 VITE_API_ENV 切换
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET || proxyTargets[apiEnv] || proxyTargets.development

  return {
    plugins: [react()],
    base: '/',
    publicDir: 'public',
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: ['www.xuezhiai.cn', 'xuezhiai.cn'],
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // 确保 public 目录下的文件被正确复制
      copyPublicDir: true,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
