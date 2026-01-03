import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME } from '@/lib/constants'

export async function POST() {
  cookies().delete(AUTH_COOKIE_NAME)
  return NextResponse.json({ success: true })
}
