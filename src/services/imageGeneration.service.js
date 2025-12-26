/**
 * 图片生成服务
 * 处理效果图生成相关的 API 请求
 */

import { API_ENDPOINTS } from '../config/api.config';

/**
 * 流式生成效果图
 * @param {Object} params - 请求参数
 * @param {string} params.prompt - 提示词
 * @param {number} params.max_images - 生成图片数量
 * @param {string} params.size - 图片尺寸 (2K, 4K等)
 * @param {Function} onMessage - 接收消息的回调函数 (data) => void
 * @param {Function} onComplete - 完成时的回调函数 (result) => void
 * @param {Function} onError - 错误时的回调函数 (error) => void
 * @returns {Function} 取消请求的函数
 */
export const generateEffectImages = ({
  prompt,
  max_images = 2,
  size = '2K',
  onMessage,
  onComplete,
  onError,
}) => {
  const controller = new AbortController();

  const fetchStream = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.IMAGE_GENERATION.GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          max_images,
          size,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // 解码数据并添加到缓冲区
        buffer += decoder.decode(value, { stream: true });

        // 按行处理数据
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留未完成的行

        for (const line of lines) {
          if (line.trim() === '') continue;

          // 解析 SSE 格式数据: data: {...}
          if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6).trim();

            try {
              const data = JSON.parse(jsonStr);
              onMessage(data);

              // 检查是否完成
              if (data.type === 'completed') {
                onComplete(data);
                return;
              }
            } catch (parseError) {
              console.error('解析 SSE 数据失败:', parseError, jsonStr);
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求已取消');
      } else {
        onError(error);
      }
    }
  };

  fetchStream();

  // 返回取消函数
  return () => controller.abort();
};
