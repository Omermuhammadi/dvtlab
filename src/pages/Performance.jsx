import React, { useState, useEffect } from 'react'
import StackedBarChart from '../visuals/StackedBarChart'
import BubbleChart from '../visuals/BubbleChart'
import HeatmapChart from '../visuals/HeatmapChart'
import Filters from '../components/Filters'
import medalData from '../data/medal_counts_by_country.json'

function Performance() {
  const [countryData, setCountryData] = useState([])
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    // Load top 20 countries for better visualization
    const topCountries = medalData.slice(0, 20)
    setCountryData(topCountries)
    setFilteredData(topCountries)
  }, [])

  const handleFiltersChange = (filters) => {
    let filtered = [...countryData]
    
    // Filter by selected countries
    if (filters.countries && filters.countries.length > 0) {
      filtered = filtered.filter(country => 
        filters.countries.includes(country.country || country.code)
      )
    }
    
    // Apply medal type filter
    if (filters.medals && filters.medals.length > 0) {
      filtered = filtered.map(country => {
        const newCountry = { ...country }
        if (!filters.medals.includes('gold')) newCountry.gold = 0
        if (!filters.medals.includes('silver')) newCountry.silver = 0
        if (!filters.medals.includes('bronze')) newCountry.bronze = 0
        return newCountry
      })
    }
    
    setFilteredData(filtered)
  }

  return (
    <div className="performance-page">
      <div className="page-header">
        <h1 className="page-title">🏆 Performance & Medal Analysis</h1>
        <p className="page-subtitle">
          Deep dive into country performance, medal trends, and competitive analysis across Olympic history
        </p>
      </div>

      {/* Filters */}
      <Filters 
        onFiltersChange={handleFiltersChange}
        data={countryData}
      />

      {/* Stacked Bar Chart - Medal Types by Country */}
      <div className="chart-container">
        <h2 className="chart-title">🥇 Medal Distribution by Type (Top 20 Countries)</h2>
        <p className="chart-description">
          This stacked bar chart shows the breakdown of <strong>Gold</strong>, <strong>Silver</strong>, and <strong>Bronze</strong> medals 
          for the top performing countries. Notice how some countries excel in specific medal types - 
          the USA leads in gold medals while maintaining strong performance across all categories.
        </p>
        <StackedBarChart data={filteredData} width={900} height={500} />
        <div className="chart-insight">
          💡 <strong>Key Insight:</strong> The USA has the highest gold medal count (1,180), representing 35% of their total medals. 
          Germany shows the most balanced distribution across all three medal types.
        </div>
      </div>

      {/* Bubble Chart - Gold vs Silver Performance */}
      <div className="chart-container">
        <h2 className="chart-title">🎯 Gold vs Silver Medal Performance</h2>
        <p className="chart-description">
          This bubble chart plots <strong>Gold medals (X-axis)</strong> against <strong>Silver medals (Y-axis)</strong>, 
          with bubble size representing total medal count. Countries closer to the top-right have 
          consistently high performance in both gold and silver categories.
        </p>
        <BubbleChart data={filteredData} width={800} height={500} />
        <div className="chart-insight">
          💡 <strong>Key Insight:</strong> There's a strong correlation between gold and silver medal counts. 
          Countries that excel in one category typically perform well in others, indicating consistent athletic programs.
        </div>
      </div>

      {/* Heatmap - Medal Type Distribution */}
      <div className="chart-container">
        <h2 className="chart-title">🔥 Medal Type Heatmap (Top 12 Countries)</h2>
        <p className="chart-description">
          This heatmap visualizes the intensity of medal counts across different types for top countries. 
          Darker colors indicate higher medal counts. This view makes it easy to identify 
          each country's strengths and compare performance patterns.
        </p>
        <HeatmapChart data={filteredData} width={800} height={450} />
        <div className="chart-insight">
          💡 <strong>Key Insight:</strong> The heatmap reveals that traditional Olympic powers like USA, USSR, and Germany 
          dominate across all medal types, while newer Olympic nations tend to specialize in specific categories.
        </div>
      </div>

      {/* Performance Statistics */}
      <div className="chart-container">
        <h2 className="chart-title">📊 Performance Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">2,980</div>
            <div className="stat-label">USA Total Medals</div>
            <div className="stat-detail">Leading all nations</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">39.6%</div>
            <div className="stat-label">USA Gold Ratio</div>
            <div className="stat-detail">1,180 of 2,980 medals</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">15</div>
            <div className="stat-label">Countries with 1000+ Medals</div>
            <div className="stat-detail">Elite Olympic nations</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">47%</div>
            <div className="stat-label">Top 3 Countries Share</div>
            <div className="stat-detail">USA, USSR, Germany combined</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Performance
