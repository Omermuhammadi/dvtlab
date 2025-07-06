import React, { useState } from 'react'

const UsageGuide = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const examples = [
    {
      title: "🇺🇸 USA Swimming Dominance",
      filters: "Country: USA, Sport: Swimming",
      insight: "See how USA has dominated swimming with 200+ total medals"
    },
    {
      title: "🚴‍♂️ British Cycling Success",
      filters: "Country: Great Britain, Sport: Cycling",
      insight: "Discover GB's cycling transformation since 2008 Olympics"
    },
    {
      title: "🤸‍♀️ Gymnastics Powerhouses",
      filters: "Sport: Gymnastics",
      insight: "Compare USA, Soviet Union, China, and Japan in gymnastics"
    },
    {
      title: "🏃‍♂️ Athletics Champions",
      filters: "Sport: Athletics, Years: 2008-2016",
      insight: "Track recent performance in the world's most popular Olympic sport"
    }
  ]

  return (
    <div className="usage-guide">
      <div className="usage-guide-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>💡 How to Use Interactive Filters</h3>
        <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div className="usage-guide-content">
          <p className="usage-instructions">
            Use the filters above to explore specific combinations of countries, sports, and time periods. 
            All charts below will update in real-time to show your selection.
          </p>
          
          <h4>🎯 Try These Examples:</h4>
          <div className="example-grid">
            {examples.map((example, index) => (
              <div key={index} className="example-card">
                <h5>{example.title}</h5>
                <p className="example-filters"><strong>Try:</strong> {example.filters}</p>
                <p className="example-insight">{example.insight}</p>
              </div>
            ))}
          </div>
          
          <div className="usage-tips">
            <h4>📋 Pro Tips:</h4>
            <ul>
              <li>Start with 1-2 countries and 1 sport for focused analysis</li>
              <li>Use the heatmap to discover unexpected strong country-sport combinations</li>
              <li>Compare trends over time to see rising and declining performance</li>
              <li>Clear all filters to see global patterns and comparisons</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsageGuide
