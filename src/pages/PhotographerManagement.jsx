import React from 'react'
import './TalentIframePage.css'

const PhotographerManagement = () => {
  return (
    <div className="talent-iframe-container">
      <iframe
        className="talent-iframe"
        src={`${import.meta.env.BASE_URL}static/talent/construction_team.html`}
        title="全球建设工程师"
        loading="lazy"
      />
    </div>
  )
}

export default PhotographerManagement
