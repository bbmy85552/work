import React from 'react'
import './TalentIframePage.css'

const TalentManagement = () => {
  return (
    <div className="talent-iframe-container">
      <iframe
        className="talent-iframe"
        src={`${import.meta.env.BASE_URL}static/talent/integrated_apple_style.html`}
        title="人才概览"
        loading="lazy"
      />
    </div>
  )
}

export default TalentManagement
