import React from 'react'

function Overview() {
  return (
    <div className="overview-page">
      <div className="page-header">
        <h1 className="page-title">Olympics Overview Dashboard</h1>
        <p className="page-subtitle">
          High-level insights and key performance indicators from 120 years of Olympic history
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value">51,090</div>
          <div className="kpi-label">Total Athletes</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">230</div>
          <div className="kpi-label">Countries</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">66</div>
          <div className="kpi-label">Sports</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">765</div>
          <div className="kpi-label">Events</div>
        </div>
      </div>

      {/* Summary Charts */}
      <div className="chart-container">
        <h2 className="chart-title">Medal Distribution Over Time</h2>
        <p className="chart-description">
          This visualization will show how medal distribution has evolved across different Olympic games.
        </p>
        <div style={{ height: '400px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
          <span style={{ color: '#64748b', fontSize: '1.1rem' }}>Chart will be implemented with D3.js</span>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Top Performing Countries</h2>
        <p className="chart-description">
          Countries with the highest medal counts across all Olympic games.
        </p>
        <div style={{ height: '400px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
          <span style={{ color: '#64748b', fontSize: '1.1rem' }}>Chart will be implemented with D3.js</span>
        </div>
      </div>
    </div>
  )
}

export default Overview
