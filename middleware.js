import { NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME } from './src/lib/constants'

const PUBLIC_PATHS = ['/login']

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

  if (!token && !PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    const redirectUrl = new URL('/login', request.url)
    const qs = searchParams.toString()
    const redirectTarget = pathname === '/' ? '/bi-cockpit' : `${pathname}${qs ? `?${qs}` : ''}`
    redirectUrl.searchParams.set('redirect', redirectTarget)
    return NextResponse.redirect(redirectUrl)
  }

  if (token && pathname === '/login') {
    const dashboardUrl = new URL('/bi-cockpit', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|.*\\..*).*)']
}
