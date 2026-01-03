import { AUTH_COOKIE_NAME } from '@/lib/constants'

const defaultHeaders = {
  'Content-Type': 'application/json'
}

export async function signIn({ username, password }) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ username, password })
    })

    if (!res.ok) return false
    const data = await res.json()
    return Boolean(data?.success)
  } catch (error) {
    console.error('登录失败', error)
    return false
  }
}

export async function signOut() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch (error) {
    console.error('退出登录失败', error)
  }
}

export function hasAuthCookie() {
  if (typeof document === 'undefined') return false
  return document.cookie.split(';').some((item) => item.trim().startsWith(`${AUTH_COOKIE_NAME}=`))
}
