/**
 * 图片配置工具
 * 支持 CDN 和本地路径切换，便于部署优化
 */

// 图片 CDN 基础 URL
// 生产环境建议使用 CDN（如阿里云 OSS、腾讯云 COS、AWS S3 等）
// 开发环境可以使用本地路径或空字符串
const IMAGE_CDN_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_CDN_BASE_URL || '';

// 本地图片基础路径（当不使用 CDN 时）
const LOCAL_IMAGE_BASE_PATH = '/campus-buildings';

/**
 * 获取完整的图片 URL
 * @param {string} imagePath - 图片路径（如 '/campus-buildings/001.png'）
 * @returns {string} 完整的图片 URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/400x200?text=暂无图片';
  }

  // 如果已经是完整 URL（http/https），直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // 如果配置了 CDN，使用 CDN URL
  if (IMAGE_CDN_BASE_URL) {
    // 移除路径开头的斜杠，CDN URL 通常已经包含路径分隔符
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${IMAGE_CDN_BASE_URL}/${cleanPath}`;
  }

  // 否则使用本地路径
  return imagePath;
};

/**
 * 获取图片占位符 URL（用于懒加载）
 * @param {number} width - 图片宽度
 * @param {number} height - 图片高度
 * @returns {string} 占位符 URL
 */
export const getPlaceholderUrl = (width = 400, height = 200) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%23f0f0f0' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='14' fill='%23999'%3E加载中...%3C/text%3E%3C/svg%3E`;
};

/**
 * 检查图片是否加载失败
 * @param {Event} event - 图片加载错误事件
 * @returns {string} 默认占位符 URL
 */
export const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x200?text=图片加载失败';
};

export default {
  getImageUrl,
  getPlaceholderUrl,
  handleImageError,
  IMAGE_CDN_BASE_URL,
  LOCAL_IMAGE_BASE_PATH
};
