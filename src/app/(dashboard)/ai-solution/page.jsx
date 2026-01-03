'use client'

import dynamic from 'next/dynamic'

const AISolutionCenter = dynamic(() => import('@legacy/AISolutionCenter'), { ssr: false })

export default function AISolutionCenterPage() {
  return <AISolutionCenter />
}
