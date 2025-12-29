/**
 * 政策搜索服务
 * 处理政府+人工智能政策搜索相关的 API 请求
 */

import { API_ENDPOINTS } from '../config/api.config';

/**
 * 流式生成政策搜索结果
 * @param {Object} params - 请求参数
 * @param {string} params.city - 城市名称
 * @param {Array<string>} params.keywords - 关键词列表
 * @param {Function} onMessage - 接收消息的回调函数 (data) => void
 * @param {Function} onComplete - 完成时的回调函数 (result) => void
 * @param {Function} onError - 错误时的回调函数 (error) => void
 * @returns {Function} 取消请求的函数
 */
export const generatePolicySearch = ({
  city,
  keywords,
  onMessage,
  onComplete,
  onError,
}) => {
  const controller = new AbortController();

  const fetchStream = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.POLICY_SEARCH.GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city,
          keywords,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      let completedPayload = null;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // 解码数据并添加到缓冲区
        buffer += decoder.decode(value, { stream: true });

        // 按行处理数据
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;

          if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6).trim();

            try {
              const data = JSON.parse(jsonStr);
              onMessage(data);

              if (data.type === 'completed') {
                completedPayload = data;
              }
            } catch (parseError) {
              console.error('解析 SSE 数据失败:', parseError, jsonStr);
            }
          }
        }
      }

      onComplete(completedPayload || { type: 'completed' });
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求已取消');
      } else {
        onError(error);
      }
    }
  };

  fetchStream();

  return () => controller.abort();
};
