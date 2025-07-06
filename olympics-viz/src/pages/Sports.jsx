import React from 'react'

function Sports() {
  return (
    <div className="sports-page">
      <div className="page-header">
        <h1 className="page-title">Sports & Athletes Insights</h1>
        <p className="page-subtitle">
          Analysis of sports trends, athlete demographics, and event evolution
        </p>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Medal Distribution by Sport</h2>
        <p className="chart-description">
          Sunburst or treemap visualization showing medal distribution across different sports and events.
        </p>
        <div style={{ height: '500px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
          <span style={{ color: '#64748b', fontSize: '1.1rem' }}>D3.js Sunburst/Treemap</span>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Athlete Age vs Medal Performance</h2>
        <p className="chart-description">
          Scatter plot analyzing the relationship between athlete age and medal wins.
        </p>
        <div style={{ height: '400px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
          <span style={{ color: '#64748b', fontSize: '1.1rem' }}>D3.js Scatter Plot</span>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Athlete Participation Trends</h2>
        <p className="chart-description">
          Line chart showing athlete participation trends over time by gender and sport.
        </p>
        <div style={{ height: '400px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
          <span style={{ color: '#64748b', fontSize: '1.1rem' }}>D3.js Line Chart</span>
        </div>
      </div>
    </div>
  )
}

export default Sports
