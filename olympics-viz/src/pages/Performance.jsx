import React from 'react'

function Performance() {
  return (
    <div className="performance-page">
      <div className="page-header">
        <h1 className="page-title">Performance & Medal Analysis</h1>
        <p className="page-subtitle">
          Deep dive into country performance, medal trends, and competitive analysis
        </p>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Year Range</label>
            <input type="range" min="1896" max="2024" defaultValue="2024" />
          </div>
          <div className="filter-group">
            <label className="filter-label">Season</label>
            <select>
              <option value="all">All Seasons</option>
              <option value="summer">Summer</option>
              <option value="winter">Winter</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Countries</label>
            <select>
              <option value="all">All Countries</option>
              <option value="usa">United States</option>
              <option value="chn">China</option>
              <option value="gbr">Great Britain</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Medal Type</label>
            <select>
              <option value="all">All Medals</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Medal Count by Country (Top 20)</h2>
        <p className="chart-description">
          Vertical bar chart showing the top 20 countries by total medal count.
        </p>
        <div style={{ height: '500px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
          <span style={{ color: '#64748b', fontSize: '1.1rem' }}>D3.js Bar Chart</span>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">World Map - Medal Distribution</h2>
        <p className="chart-description">
          Choropleth map visualizing medal distribution across countries worldwide.
        </p>
        <div style={{ height: '500px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
          <span style={{ color: '#64748b', fontSize: '1.1rem' }}>D3.js Choropleth Map</span>
        </div>
      </div>
    </div>
  )
}

export default Performance
