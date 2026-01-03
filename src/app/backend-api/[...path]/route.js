import { NextResponse } from 'next/server'

export const runtime = 'nodejs' // 使用 Node.js 运行时

/**
 * 支持所有 HTTP 方法
 */
export async function GET(request, { params }) {
  return proxyRequest(request, params)
}

export async function POST(request, { params }) {
  return proxyRequest(request, params)
}

export async function PUT(request, { params }) {
  return proxyRequest(request, params)
}

export async function DELETE(request, { params }) {
  return proxyRequest(request, params)
}

export async function PATCH(request, { params }) {
  return proxyRequest(request, params)
}

/**
 * 处理 OPTIONS 预检请求
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}

/**
 * 通用代理函数（支持流式响应、FormData、JSON、所有 HTTP 方法）
 */
async function proxyRequest(request, { params }) {
  try {
    // 1. 获取后端地址（运行时读取环境变量）
    const isProd = process.env.NODE_ENV === 'production'
    const backendUrl = isProd
      ? process.env.BACKEND_API_PROXY_TARGET_PROD
      : process.env.BACKEND_API_PROXY_TARGET_DEV

    if (!backendUrl) {
      console.error('[API Proxy] Backend URL not configured')
      return NextResponse.json(
        { error: 'Backend API URL not configured' },
        { status: 500 }
      )
    }

    // 2. 从 nextUrl 中提取路径（不依赖 params，因为它可能为 undefined）
    // 请求: /backend-api/v1/wall-design/generate
    // 需要提取: v1/wall-design/generate
    const fullPath = request.nextUrl.pathname // /backend-api/v1/wall-design/generate
    const pathPrefix = '/backend-api/'
    const pathPart = fullPath.startsWith(pathPrefix)
      ? fullPath.slice(pathPrefix.length) // v1/wall-design/generate
      : fullPath.slice(1) // 去掉开头的 /

    const pathSegments = pathPart.split('/').filter(Boolean) // ['v1', 'wall-design', 'generate']

    // 如果 params 可用，使用它（生产环境可能正常）
    const finalPath = (params?.path && params.path.length > 0)
      ? params.path
      : pathSegments

    const queryString = request.nextUrl.search || ''
    const targetUrl = `${backendUrl}/api/${finalPath.join('/')}${queryString}`

    console.log('[API Proxy]', request.method, targetUrl)

    // 3. 准备请求头和请求体
    let body = null
    const headers = new Headers()

    // 只添加 Authorization，不手动设置 Content-Type
    const auth = request.headers.get('Authorization')
    if (auth) {
      headers.set('Authorization', auth)
    }

    // 4. 准备请求体（根据 Content-Type 处理）
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const ct = request.headers.get('Content-Type') || ''

      if (ct.includes('multipart/form-data')) {
        // FormData 文件上传（用于 image-generation/generate-with-files）
        // ⚠️ 重要：不要手动设置 Content-Type，让 fetch API 自动处理 boundary
        body = await request.formData()
      } else if (ct.includes('application/json')) {
        // JSON 请求体
        const json = await request.json()
        body = JSON.stringify(json)
        headers.set('Content-Type', 'application/json')  // JSON 需要手动设置
      } else {
        // 纯文本或其他
        body = await request.text()
        if (ct) {
          headers.set('Content-Type', ct)
        }
      }
    }

    // 5. 发送代理请求
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      // 重要：不重定向，由客户端处理
      redirect: 'manual',
    })

    // 6. 流式转发响应（同时支持流式和非流式）
    if (response.body) {
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'application/json',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    }

    // 7. 降级处理（理论上不会执行到这里）
    const data = await response.text()
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    console.error('[API Proxy Error]', error)
    return NextResponse.json(
      { error: 'Proxy request failed', message: error.message },
      { status: 500 }
    )
  }
}
