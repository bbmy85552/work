import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME } from '@/lib/constants'

const DEFAULT_USERNAME = process.env.AUTH_USERNAME || 'lixiang'
const DEFAULT_PASSWORD = process.env.AUTH_PASSWORD || 'lixiang'

export async function POST(request) {
  try {
    const body = await request.json()
    const { username, password } = body || {}

    if (username !== DEFAULT_USERNAME || password !== DEFAULT_PASSWORD) {
      return NextResponse.json({ success: false, error: 'INVALID_CREDENTIALS' }, { status: 401 })
    }

    cookies().set({
      name: AUTH_COOKIE_NAME,
      value: '1',
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 12 // 12 hours
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('登录接口错误', error)
    return NextResponse.json({ success: false, error: 'UNKNOWN_ERROR' }, { status: 500 })
  }
}
