import React from 'react'
import './TalentIframePage.css'

const EngineerManagement = () => {
  return (
    <div className="talent-iframe-container">
      <iframe
        className="talent-iframe"
        src="/static/talent/design_team.html"
        title="全球设计师中心"
        loading="lazy"
      />
    </div>
  )
}

export default EngineerManagement
