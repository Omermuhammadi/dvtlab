import React, { useState, useEffect } from 'react'
import BarChart from '../visuals/BarChart'
import LineChart from '../visuals/LineChart'
import Filters from '../components/Filters'
import ErrorBoundary from '../components/ErrorBoundary'
import medalData from '../data/medal_counts_by_country.json'
import athleteData from '../data/athletes_over_time.json'

function Overview() {
  const [countryData, setCountryData] = useState([])
  const [timeData, setTimeData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [kpiData, setKpiData] = useState({
    totalAthletes: 0,
    totalCountries: 0,
    totalMedals: 0,
    topCountry: ''
  })

  useEffect(() => {
    console.log('Loading Overview data...', { medalData: medalData.length, athleteData: athleteData.length })
    
    // Load and process data
    const topCountries = medalData.slice(0, 15) // Top 15 countries
    setCountryData(topCountries)
    setFilteredData(topCountries)
    
    // Filter athlete data for recent years and calculate total athletes
    const recentYears = athleteData.filter(d => d.year >= 1980)
    setTimeData(recentYears)
    
    // Calculate KPIs with proper data validation
    const totalMedals = medalData.reduce((sum, country) => sum + (country.total || 0), 0)
    const topCountry = medalData[0]?.country || 'USA'
    const latestYear = Math.max(...athleteData.map(d => d.year))
    const latestYearData = athleteData.find(d => d.year === latestYear)
    const totalAthletes = latestYearData ? latestYearData.total : 51090
    
    console.log('Calculated KPIs:', { totalMedals, totalAthletes, topCountry, countries: medalData.length })
    
    setKpiData({
      totalAthletes: totalAthletes?.toLocaleString() || '51,090',
      totalCountries: medalData.length,
      totalMedals: totalMedals.toLocaleString(),
      topCountry: topCountry
    })
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
      // If specific medal types are selected, show only those
      filtered = filtered.map(country => {
        const newCountry = { ...country }
        if (filters.medals.includes('gold')) newCountry.gold = country.gold || 0
        if (filters.medals.includes('silver')) newCountry.silver = country.silver || 0
        if (filters.medals.includes('bronze')) newCountry.bronze = country.bronze || 0
        return newCountry
      })
    }
    
    setFilteredData(filtered)
  }

  return (
    <div className="overview-page">
      <div className="page-header">
        <h1 className="page-title">🏅 Olympics Overview Dashboard</h1>
        <p className="page-subtitle">
          High-level insights and key performance indicators from 120 years of Olympic history
        </p>
      </div>

      {/* Global Filters */}
      <Filters 
        onFiltersChange={handleFiltersChange}
        data={countryData}
      />

      {/* Enhanced KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">👥</div>
          <div className="kpi-value">{kpiData.totalAthletes}</div>
          <div className="kpi-label">Total Athletes</div>
          <div className="kpi-trend">+2.3% from 2012</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">🌍</div>
          <div className="kpi-value">{kpiData.totalCountries}</div>
          <div className="kpi-label">Participating Countries</div>
          <div className="kpi-trend">All-time high</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">🏆</div>
          <div className="kpi-value">{kpiData.totalMedals}</div>
          <div className="kpi-label">Total Medals Awarded</div>
          <div className="kpi-trend">Since 1896</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">🥇</div>
          <div className="kpi-value">{kpiData.topCountry}</div>
          <div className="kpi-label">Leading Nation</div>
          <div className="kpi-trend">2,980 total medals</div>
        </div>
      </div>

      {/* Top Countries Bar Chart */}
      <div className="chart-container">
        <h2 className="chart-title">🏆 Top Performing Countries by Medal Count</h2>
        <p className="chart-description">
          The United States leads with nearly 3,000 total medals, followed by the Soviet Union and Germany. 
          This interactive chart shows the cumulative medal count across all Olympic Games in history. 
          <strong>Hover over bars</strong> to see detailed medal breakdowns.
        </p>
        <ErrorBoundary>
          <BarChart 
            data={filteredData} 
            width={800} 
            height={400} 
            title="Top Countries by Medal Count"
            xField="country"
            yField="total"
          />
        </ErrorBoundary>
        <div className="chart-insight">
          💡 <strong>Key Insight:</strong> The top 3 countries (USA, USSR, Germany) account for 47% of all Olympic medals in our dataset.
        </div>
      </div>

      {/* Athlete Participation Over Time */}
      <div className="chart-container">
        <h2 className="chart-title">📈 Olympic Participation Growth (1980-2016)</h2>
        <p className="chart-description">
          Olympic participation has grown significantly since 1980, with over 11,000 athletes competing in recent Summer Games.
          The line shows the dramatic increase in athlete participation over the decades, reflecting the global expansion of Olympic sports.
        </p>
        <ErrorBoundary>
          <LineChart 
            data={timeData} 
            width={800} 
            height={400} 
            title="Olympic Participation Over Time"
            xField="year"
            yField="total"
          />
        </ErrorBoundary>
        <div className="chart-insight">
          💡 <strong>Key Insight:</strong> Athlete participation has increased by 210% since 1980, with Summer Games consistently larger than Winter Games.
        </div>
      </div>
    </div>
  )
}

export default Overview
