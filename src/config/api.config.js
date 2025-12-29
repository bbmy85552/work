/**
 * API 配置文件
 * 集中管理所有 API endpoints
 */

// 先定义常量，避免模块初始化顺序问题
const API_VERSION = 'v1';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';
const API_HOST = import.meta.env.VITE_API_BASE_URL || '';
const BASE_URL = `${API_HOST}${API_PREFIX}`;

export const API_CONFIG = {
  // 基础 URL
  BASE_URL: BASE_URL,
  API_PREFIX: API_PREFIX,

  // API 版本
  API_VERSION: API_VERSION,

  // 超时时间（毫秒）
  TIMEOUT: 60000,
};

/**
 * 构建 API endpoint
 * @param {string} path - API 路径
 * @returns {string} 完整的 API URL
 */
const buildEndpoint = (path) => {
  const normalizedBase = BASE_URL.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}/${API_VERSION}${normalizedPath}`;
};

/**
 * API Endpoints
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
  },
  // 政策搜索相关
  POLICY_SEARCH: {
    GENERATE: buildEndpoint('/policy-search/generate'), // 生成政策搜索结果
  },
};

export default API_CONFIG;
