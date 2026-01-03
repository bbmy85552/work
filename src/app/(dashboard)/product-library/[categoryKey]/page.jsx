'use client'

import ProductLibrary from '@legacy/ProductLibrary'

export default function ProductLibraryCategoryPage({ params }) {
  return <ProductLibrary categoryKey={params?.categoryKey} />
}
