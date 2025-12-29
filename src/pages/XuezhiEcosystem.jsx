import React from 'react'
import './XuezhiEcosystem.css'

export default function XuezhiEcosystem() {
  return (
    <div className="xe-container">
      <iframe
        className="xe-iframe"
        src={`${import.meta.env.BASE_URL}static/misc/xuezhi_ecosystem.html`}
        title="学智AI共建生态圈"
        loading="lazy"
      />
    </div>
  )
}
