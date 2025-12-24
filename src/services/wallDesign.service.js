/**
 * 科技墙设计服务
 * 处理科技墙方案生成相关的 API 请求
 */

import { API_ENDPOINTS } from '../config/api.config';

/**
 * 流式生成科技墙设计方案
 * @param {Object} params - 请求参数
 * @param {string} params.school_name - 学校名称
 * @param {string} params.style - 设计风格
 * @param {Function} onMessage - 接收消息的回调函数 (data) => void
 * @param {Function} onComplete - 完成时的回调函数 (result) => void
 * @param {Function} onError - 错误时的回调函数 (error) => void
 * @returns {Function} 取消请求的函数
 */
export const generateWallDesign = ({
  school_name,
  style,
  onMessage,
  onComplete,
  onError,
}) => {
  const controller = new AbortController();

  const fetchStream = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WALL_DESIGN.GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          school_name,
          style,
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

/**
 * 更新科技墙设计任务的 json_result
 * @param {Object} params
 * @param {string} params.taskId - 任务ID
 * @param {Object} params.jsonResult - 要保存的方案内容
 * @param {Object} params.userParams - 可选，更新 user_params
 */
export const updateWallDesignTask = async ({ taskId, jsonResult, userParams }) => {
  if (!taskId) {
    throw new Error('缺少任务ID，无法保存方案');
  }

  const response = await fetch(API_ENDPOINTS.WALL_DESIGN.TASK(taskId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      json_result: jsonResult,
      user_params: userParams,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`保存方案失败: ${errorText || response.status}`);
  }

  return response.json();
};

/**
 * 解析流式内容为 JSON
 * @param {Array<string>} contentChunks - 内容块数组
 * @returns {Object|null} 解析后的 JSON 对象
 */
export const parseStreamedContent = (contentChunks) => {
  try {
    const fullContent = contentChunks.join('');
    return JSON.parse(fullContent);
  } catch (error) {
    console.error('解析流式内容失败:', error);
    return null;
  }
};
