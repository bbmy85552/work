import React from 'react'

const TalentManagement = () => {
  return (
    <div className="talent-iframe-container">
      <iframe
        className="talent-iframe"
        src="/static/talent/integrated_apple_style.html"
        title="人才概览"
        loading="lazy"
      />
    </div>
  )
}

export default TalentManagement
