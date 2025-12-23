/**
 * API 配置文件
 * 集中管理所有 API endpoints
 */

// 先定义常量，避免模块初始化顺序问题
const API_VERSION = 'v1';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_CONFIG = {
  // 基础 URL
  BASE_URL: BASE_URL,

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
  return `${BASE_URL}/api/${API_VERSION}${path}`;
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // 科技墙设计相关
  WALL_DESIGN: {
    GENERATE: buildEndpoint('/wall-design/generate'), // 生成科技墙设计方案
  },
};

export default API_CONFIG;
