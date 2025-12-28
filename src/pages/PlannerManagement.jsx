import React from 'react'
import './TalentIframePage.css'

const PlannerManagement = () => {
  return (
    <div className="talent-iframe-container">
      <iframe
        className="talent-iframe"
        src={`${import.meta.env.BASE_URL}static/talent/engineer_team.html`}
        title="全球AI工程师库"
        loading="lazy"
      />
    </div>
  )
}

export default PlannerManagement
