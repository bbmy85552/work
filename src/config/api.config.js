/**
 * 外部后端 API 配置文件
 * 集中管理所有外部后端的 API endpoints（AI 生成、搜索等）
 *
 * 架构说明：
 * - /api/* → Next.js API Routes (登录、学校数据等)
 * - /backend-api/* → 外部后端服务器 (AI 生成、搜索等)
 */

// API 版本
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1'

// 外部后端 API 基础路径（通过 Next.js rewrites 代理到后端服务器）
const BACKEND_API_BASE = '/backend-api'

export const API_CONFIG = {
  BASE_URL: BACKEND_API_BASE,
  API_VERSION,
  TIMEOUT: 60000
}

/**
 * 构建外部后端 API endpoint
 * @param {string} path - API 路径
 * @returns {string} 完整的 API URL
 */
const buildEndpoint = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${BACKEND_API_BASE}/${API_VERSION}${normalizedPath}`
}

/**
 * 外部后端 API Endpoints
 */
export const API_ENDPOINTS = {
  // 科技墙设计相关
  WALL_DESIGN: {
    GENERATE: buildEndpoint('/wall-design/generate'), // 生成科技墙设计方案
    TASK: (taskId) => buildEndpoint(`/wall-design/task/${taskId}`), // 获取/更新科技墙方案
  },
  // 图片生成相关
  IMAGE_GENERATION: {
    GENERATE: buildEndpoint('/image-generation/generate'), // 生成效果图
    GENERATE_WITH_FILES: buildEndpoint('/image-generation/generate-with-files'), // 生成效果图（支持文件上传）
  },
  // 政策搜索相关
  POLICY_SEARCH: {
    GENERATE: buildEndpoint('/policy-search/generate'), // 生成政策搜索结果
  },
}

export default API_CONFIG
