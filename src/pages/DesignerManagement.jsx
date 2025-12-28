import React from 'react'
import './TalentIframePage.css'

const DesignerManagement = () => {
  return (
    <div className="talent-iframe-container">
      <iframe
        className="talent-iframe"
        src={`${import.meta.env.BASE_URL}static/talent/education_experts.html`}
        title="全球教育专家库"
        loading="lazy"
      />
    </div>
  )
}

export default DesignerManagement
