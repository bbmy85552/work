import React from 'react'

export default function ProductLibraryGallery() {
  return (
    <div className="pl-gallery-container">
      <iframe
        className="pl-gallery-iframe"
        src="/static/product-library/final_gallery.html"
        title="学智AI产品库展示"
        loading="lazy"
      />
    </div>
  )
}
