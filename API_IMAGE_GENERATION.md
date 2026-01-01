# 图片生成接口文档

## 概述

图片生成接口基于火山引擎 ARK API 的豆包图像生成模型，支持流式返回多张图片 URL。

**接口路径：** `/api/v1/image-generation/generate`

**请求方法：** `POST`

**响应类型：** `Server-Sent Events (SSE)` 流式响应

---

## 接口列表

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/v1/image-generation/generate` | POST | 流式生成图片（JSON格式，支持URL或纯文本） |
| `/api/v1/image-generation/generate-with-files` | POST | 流式生成图片（支持文件上传，图生图） |
| `/api/v1/image-generation/task/{task_id}` | GET | 获取任务详情 |
| `/api/v1/image-generation/tasks` | GET | 获取任务列表 |

---

## 1. 流式生成图片

### 请求

**URL：** `POST /api/v1/image-generation/generate`

**请求头：**
```
Content-Type: application/json
```

**请求体：**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `prompt` | string | 是 | - | 图片生成提示词（1-5000字符） |
| `max_images` | integer | 否 | 6 | 生成的图片数量（1-10） |
| `size` | string | 否 | "2K" | 图片尺寸（支持：2K, 1080p, 720p） |

**请求示例：**

```bash
curl -X POST "http://localhost:8000/api/v1/image-generation/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "请为学校设计一面科技墙，宽度8米，高度3米，现代简约科技风格，需要6张不同的设计效果图",
    "max_images": 6,
    "size": "2K"
  }'
```

### 响应

**响应格式：** `text/event-stream`

**事件类型：**

#### 1.1 `image_generated` - 图片生成完成事件

单张图片生成完成时触发。

```json
data: {
  "type": "image_generated",
  "data": {
    "image_index": 0,
    "url": "https://ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com/doubao-seedream-4-5/xxx_0.jpeg?...",
    "size": "2496x1664"
  },
  "timestamp": "2025-12-26T00:18:33.123456"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | string | 事件类型：`image_generated` |
| `data.image_index` | integer | 图片索引（从0开始） |
| `data.url` | string | 图片 URL（24小时有效） |
| `data.size` | string | 图片尺寸 |
| `timestamp` | string | 事件时间戳（ISO 8601） |

#### 1.2 `completed` - 全部完成事件

所有图片生成完成时触发，包含统计信息和任务 ID。

```json
data: {
  "type": "completed",
  "data": {
    "total_images": 6,
    "urls": [
      "https://ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com/doubao-seedream-4-5/xxx_0.jpeg?...",
      "https://ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com/doubao-seedream-4-5/xxx_1.jpeg?...",
      "..."
    ],
    "usage": {
      "generated_images": 6,
      "output_tokens": 97344,
      "total_tokens": 97344,
      "total_time_seconds": 60.87
    },
    "task_id": "550e8400-e29b-41d4-a716-446655440000"
  },
  "timestamp": "2025-12-26T00:19:33.123456"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | string | 事件类型：`completed` |
| `data.total_images` | integer | 生成的图片总数 |
| `data.urls` | array | 所有图片 URL 列表 |
| `data.usage.generated_images` | integer | 成功生成的图片数 |
| `data.usage.output_tokens` | integer | 输出的 token 数量 |
| `data.usage.total_tokens` | integer | 总 token 数量 |
| `data.usage.total_time_seconds` | float | 总耗时（秒） |
| `data.task_id` | string | 任务 ID（可用于后续查询） |
| `timestamp` | string | 事件时间戳 |

#### 1.3 `error` - 错误事件

生成过程中发生错误时触发。

```json
data: {
  "type": "error",
  "data": {
    "error": "Image generation failed",
    "details": "具体错误信息..."
  },
  "timestamp": "2025-12-26T00:18:30.123456"
}
```

### JavaScript 客户端示例

```javascript
async function generateImages(prompt, maxImages = 6) {
  const response = await fetch('http://localhost:8000/api/v1/image-generation/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      max_images: maxImages,
      size: '2K'
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const urls = [];
  let taskId = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.substring(6));

        switch (data.type) {
          case 'image_generated':
            console.log(`图片 ${data.data.image_index + 1} 生成完成:`, data.data.url);
            urls.push(data.data.url);
            // 实时显示图片
            displayImage(data.data.url, data.data.image_index);
            break;

          case 'completed':
            console.log('全部完成！', data.data);
            taskId = data.data.task_id;
            console.log('使用统计:', data.data.usage);
            break;

          case 'error':
            console.error('生成失败:', data.data);
            break;
        }
      }
    }
  }

  return { urls, taskId };
}

function displayImage(url, index) {
  const imgContainer = document.getElementById('images');
  const img = document.createElement('img');
  img.src = url;
  img.alt = `Generated image ${index + 1}`;
  imgContainer.appendChild(img);
}

// 使用示例
generateImages('请为学校设计一面科技墙，宽度8米，高度3米，现代简约科技风格', 6);
```

### Python 客户端示例

```python
import requests
import json

def generate_images(prompt: str, max_images: int = 6):
    url = "http://localhost:8000/api/v1/image-generation/generate"
    payload = {
        "prompt": prompt,
        "max_images": max_images,
        "size": "2K"
    }

    with requests.post(url, json=payload, stream=True) as response:
        image_urls = []
        task_id = None

        for line in response.iter_lines():
            if line and line.startswith(b'data: '):
                data = json.loads(line[6:])

                if data['type'] == 'image_generated':
                    img_data = data['data']
                    print(f"图片 {img_data['image_index'] + 1} 生成完成")
                    image_urls.append(img_data['url'])

                elif data['type'] == 'completed':
                    print(f"\n全部完成！共 {data['data']['total_images']} 张图片")
                    task_id = data['data']['task_id']
                    print(f"任务 ID: {task_id}")
                    print(f"使用统计: {data['data']['usage']}")

                elif data['type'] == 'error':
                    print(f"错误: {data['data']}")

        return image_urls, task_id

# 使用示例
urls, task_id = generate_images(
    prompt="请为学校设计一面科技墙，宽度8米，高度3米，现代简约科技风格",
    max_images=6
)
print(f"生成的图片 URLs: {urls}")
```

---

## 2. 获取任务详情

### 请求

**URL：** `GET /api/v1/image-generation/task/{task_id}`

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `task_id` | string | 任务 ID（从 completed 事件获取） |

**请求示例：**

```bash
curl "http://localhost:8000/api/v1/image-generation/task/550e8400-e29b-41d4-a716-446655440000"
```

### 响应

```json
{
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "image_generation",
  "prompt": "请为学校设计一面科技墙...",
  "urls": [
    "https://ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com/doubao-seedream-4-5/xxx_0.jpeg?...",
    "https://ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com/doubao-seedream-4-5/xxx_1.jpeg?..."
  ],
  "usage_stats": {
    "generated_images": 6,
    "output_tokens": 97344,
    "total_tokens": 97344,
    "total_time_seconds": 60.87
  },
  "created_at": "2025-12-26T00:17:32",
  "updated_at": "2025-12-26T00:18:33"
}
```

---

## 3. 获取任务列表

### 请求

**URL：** `GET /api/v1/image-generation/tasks`

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `limit` | integer | 否 | 10 | 返回数量限制 |
| `offset` | integer | 否 | 0 | 偏移量（用于分页） |

**请求示例：**

```bash
curl "http://localhost:8000/api/v1/image-generation/tasks?limit=10&offset=0"
```

### 响应

```json
{
  "tasks": [
    {
      "task_id": "550e8400-e29b-41d4-a716-446655440000",
      "prompt": "请为学校设计一面科技墙...",
      "total_images": 6,
      "created_at": "2025-12-26T00:17:32"
    }
  ],
  "total": 10,
  "limit": 10,
  "offset": 0
}
```

---

## 4. 流式生成图片（支持文件上传）

### 请求

**URL：** `POST /api/v1/image-generation/generate-with-files`

**请求类型：** `multipart/form-data`

**表单字段：**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `prompt` | string | 是 | - | 图片生成提示词（1-5000字符） |
| `max_images` | integer | 否 | 6 | 生成的图片数量（1-10） |
| `size` | string | 否 | "2K" | 图片尺寸（支持：2K, 1080p, 720p） |
| `images` | file[] | 否 | null | 参考图片文件（0-多张，支持图片上传） |

**功能说明：**

- **不上传图片**：纯文本生成图片（文生图）
- **上传1张图片**：单图生图
- **上传多张图片**：多图生图

**请求示例（curl）：**

```bash
# 文生图（不传图片）
curl -X POST "http://localhost:8000/api/v1/image-generation/generate-with-files" \
  -F "prompt=请为学校设计一面科技墙，宽度8米，高度3米" \
  -F "max_images=6" \
  -F "size=2K"

# 单图生图
curl -X POST "http://localhost:8000/api/v1/image-generation/generate-with-files" \
  -F "prompt=将服装材质从银色金属改为完全透明的清水" \
  -F "max_images=3" \
  -F "size=2K" \
  -F "images=@/path/to/reference_image.jpg"

# 多图生图
curl -X POST "http://localhost:8000/api/v1/image-generation/generate-with-files" \
  -F "prompt=生成3张女孩和奶牛玩偶在游乐园开心地坐过山车的图片" \
  -F "max_images=3" \
  -F "size=2K" \
  -F "images=@/path/to/image1.png" \
  -F "images=@/path/to/image2.png"
```

**请求示例（JavaScript）：**

```javascript
async function generateImagesWithFiles(prompt, images = [], maxImages = 6) {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('max_images', maxImages);
  formData.append('size', '2K');

  // 添加图片文件（如果有）
  for (const image of images) {
    formData.append('images', image);
  }

  const response = await fetch('http://localhost:8000/api/v1/image-generation/generate-with-files', {
    method: 'POST',
    body: formData
  });

  // 处理SSE流式响应（与/generate接口相同）
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const urls = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.substring(6));

        if (data.type === 'image_generated') {
          console.log(`图片 ${data.data.image_index + 1} 生成完成:`, data.data.url);
          urls.push(data.data.url);
        } else if (data.type === 'completed') {
          console.log('全部完成！', data.data);
        } else if (data.type === 'error') {
          console.error('生成失败:', data.data);
        }
      }
    }
  }

  return urls;
}

// 使用示例：文生图
generateImagesWithFiles('请为学校设计一面科技墙', []);

// 使用示例：单图生图
const input = document.querySelector('input[type="file"]');
const file = input.files[0];
generateImagesWithFiles('将服装材质改为透明清水', [file]);

// 使用示例：多图生图
const files = Array.from(input.files);
generateImagesWithFiles('生成3张游乐园场景', files);
```

**请求示例（Python）：**

```python
import requests

def generate_images_with_files(prompt: str, image_paths: list = None, max_images: int = 6):
    url = "http://localhost:8000/api/v1/image-generation/generate-with-files"

    files = {}
    data = {
        "prompt": prompt,
        "max_images": max_images,
        "size": "2K"
    }

    # 添加图片文件（如果有）
    if image_paths:
        for i, path in enumerate(image_paths):
            files[f"images"] = open(path, "rb")

    with requests.post(url, data=data, files=files, stream=True) as response:
        # 处理SSE流式响应
        for line in response.iter_lines():
            if line and line.startswith(b'data: '):
                data = json.loads(line[6:])
                print(f"事件: {data['type']}")

# 使用示例
generate_images_with_files(
    prompt="生成3张女孩在游乐园的图片",
    image_paths=["image1.png", "image2.png"],
    max_images=3
)
```

### 响应

响应格式与 `/api/v1/image-generation/generate` 完全相同，支持以下事件类型：

- `image_generated` - 单张图片生成完成
- `completed` - 全部完成
- `error` - 错误事件

详见"1. 流式生成图片"章节的响应说明。

---

## 错误码

| HTTP 状态码 | 错误类型 | 说明 |
|------------|----------|------|
| 400 | Bad Request | 请求参数错误 |
| 404 | Not Found | 任务未找到 |
| 500 | Internal Server Error | 服务器内部错误 |

**错误响应示例：**

```json
{
  "detail": "图片生成失败: 具体错误信息"
}
```

---

## 注意事项

### 1. 环境变量配置

确保 `.env` 文件中配置了以下变量：

```bash
# 豆包ARK API配置
ARK_API_KEY=your_api_key_here

# 腾讯云COS配置（用于文件上传功能）
COS_SECRET_ID=your_cos_secret_id
COS_SECRET_KEY=your_cos_secret_key
COS_BUCKET=your_cos_bucket_name
COS_REGION=ap-guangzhou
```

### 2. 图片 URL 有效期

生成的图片 URL 默认有效期为 **24 小时**，请及时下载或保存到本地/自己的存储服务。

### 3. 超时设置

接口超时时间设置为 **300 秒（5分钟）**，适合生成 6-10 张图片。

### 4. 并发限制

根据火山引擎 ARK API 的限制，请注意并发请求数量，避免超出配额。

### 5. 提示词建议

- 提示词长度：1-5000 字符
- 建议包含具体要求（尺寸、风格、数量等）
- 明确指定图片类型（墙面设计、正面图等）
- 避免模糊不清的描述

**好的提示词示例：**
```
请为学校设计一面科技墙，宽度8米，高度3米，现代简约科技风格，需要6张不同的设计效果图
```

**不好的提示词示例：**
```
一面墙
```

### 6. 流式响应处理

客户端需要正确处理 SSE 流式响应：
- 按行解析（`line.split('\n')`）
- 跳过空行
- 解析 `data: ` 开头的 JSON 数据
- 处理不同事件类型

### 7. 数据存储

- 任务会自动保存到数据库 `wall_design_tasks` 表
- 通过 `user_params.type = 'image_generation'` 区分图片生成任务
- 图片 URL 保存在 `urls` 字段（数组类型）

---

## 完整流程示例

### 前端集成示例（React）

```jsx
import React, { useState } from 'react';

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState(null);

  const generateImages = async () => {
    setLoading(true);
    setImages([]);

    try {
      const response = await fetch('http://localhost:8000/api/v1/image-generation/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          max_images: 6,
          size: '2K'
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.substring(6));

            if (data.type === 'image_generated') {
              setImages(prev => [...prev, data.data.url]);
            } else if (data.type === 'completed') {
              setTaskId(data.data.task_id);
              setLoading(false);
            } else if (data.type === 'error') {
              console.error('Error:', data.data);
              setLoading(false);
            }
          }
        }
      }
    } catch (error) {
      console.error('Request failed:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="输入图片生成提示词..."
        rows={4}
      />
      <button onClick={generateImages} disabled={loading}>
        {loading ? '生成中...' : '生成图片'}
      </button>

      <div>
        {images.map((url, index) => (
          <img key={index} src={url} alt={`Generated ${index + 1}`} />
        ))}
      </div>

      {taskId && <p>任务 ID: {taskId}</p>}
    </div>
  );
}

export default ImageGenerator;
```

---

## 性能参考

基于实际测试数据：

| 图片数量 | 平均耗时 | 平均每张耗时 |
|---------|---------|-------------|
| 6 张 | 约 60 秒 | 约 10 秒/张 |

*注：实际耗时受提示词复杂度、服务器负载等因素影响*

---

## 技术栈

- **后端框架：** FastAPI
- **异步库：** httpx
- **数据库：** PostgreSQL (SQLAlchemy)
- **API 模型：** 豆包图像生成 (doubao-seedream-4-5-251128)

---

## 更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2025-12-26 | 初始版本 |
