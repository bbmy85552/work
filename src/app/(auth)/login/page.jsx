'use client'

import { Suspense } from 'react'
import Login from '@legacy/Login'

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px', textAlign: 'center' }}>加载中...</div>}>
      <Login />
    </Suspense>
  )
}
