'use client'

import ProductLibrary from '@legacy/ProductLibrary'

export default function ProductLibraryDetailPage({ params }) {
  return <ProductLibrary categoryKey={params?.categoryKey} productId={params?.productId} />
}
