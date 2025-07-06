import React, { useState, useEffect } from 'react'
import SunburstChart from '../visuals/SunburstChart'
import ScatterPlot from '../visuals/ScatterPlot'
import MultiLineChart from '../visuals/MultiLineChart'
import Filters from '../components/Filters'
import ErrorBoundary from '../components/ErrorBoundary'

// Import data directly
import sportsData from '../data/sports_demographics.json'
import athleteData from '../data/athletes_over_time.json'
import genderData from '../data/gender_participation.json'

function Sports() {
  const [filters, setFilters] = useState({
    countries: [],
    years: [1980, 2020],
    season: 'all',
    medals: [],
    sports: []
  })
  
  const [kpiData, setKpiData] = useState({
    totalSports: 0,
    avgAge: 0,
    femaleParticipation: 0,
    totalAthletes: 0
  })

  useEffect(() => {
    console.log('Loading Sports data...', { 
      sportsData: sportsData.length, 
      athleteData: athleteData.length,
      genderData: genderData.length 
    })
    
    // Calculate KPIs
    const totalSports = sportsData.length
    const avgAge = sportsData.reduce((sum, sport) => sum + (sport.avgAge || 0), 0) / sportsData.length
    const totalAthletes = sportsData.reduce((sum, sport) => sum + (sport.athletes || 0), 0)
    
    // Calculate female participation from gender data
    const femaleData = genderData.filter(d => d.gender === 'Female')
    const maleData = genderData.filter(d => d.gender === 'Male')
    const femaleParticipation = femaleData.length > 0 ? 
      (femaleData.length / (femaleData.length + maleData.length)) * 100 : 45
    
    console.log('Calculated Sports KPIs:', { totalSports, avgAge, femaleParticipation, totalAthletes })
    
    setKpiData({
      totalSports,
      avgAge: Math.round(avgAge),
      femaleParticipation: Math.round(femaleParticipation),
      totalAthletes
    })
  }, [])

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Transform sports data for scatter plot (age vs medals)
  const scatterData = sportsData.map(sport => ({
    x: sport.avgAge,
    y: sport.medals,
    name: sport.sport,
    size: sport.athletes,
    category: sport.sport
  }))

  // Filter data based on active filters
  const filteredSportsData = sportsData.filter(item => {
    return (!filters.sports || filters.sports.length === 0 || filters.sports.includes(item.sport))
  })

  const filteredGenderData = genderData.filter(item => {
    return (!filters.years || (item.year >= filters.years[0] && item.year <= filters.years[1]))
  })

  return (
    <div className="sports-page">
      <div className="page-header">
        <h1 className="page-title">Sports & Athletes Insights</h1>
        <p className="page-subtitle">
          Analysis of sports trends, athlete demographics, and event evolution
        </p>
      </div>

      <Filters 
        onFiltersChange={handleFiltersChange} 
        data={[...sportsData, ...athleteData, ...genderData]}
        showAdvanced={true}
      />

      <div className="chart-container">
        <h2 className="chart-title">Medal Distribution by Sport</h2>
        <p className="chart-description">
          Sunburst visualization showing medal distribution across different sports and events.
        </p>
        <ErrorBoundary>
          <SunburstChart data={filteredSportsData} width={600} height={600} />
        </ErrorBoundary>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Athlete Age vs Medal Performance</h2>
        <p className="chart-description">
          Scatter plot analyzing the relationship between athlete age and medal wins across different sports.
        </p>
        <ErrorBoundary>
          <ScatterPlot 
            data={scatterData} 
            width={800} 
            height={500}
            title="Age vs Medal Performance by Sport"
            xField="x"
            yField="y"
            colorField="category"
          />
        </ErrorBoundary>
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Athlete Participation Trends by Gender</h2>
        <p className="chart-description">
          Multi-line chart showing athlete participation trends over time by gender.
        </p>
        <ErrorBoundary>
          <MultiLineChart data={filteredGenderData} width={800} height={400} />
        </ErrorBoundary>
      </div>

      {/* KPI Cards */}
      <div className="insights-grid">
        <div className="insight-card">
          <h3>Sports Diversity</h3>
          <p className="insight-value">{kpiData.totalSports}</p>
          <p className="insight-description">Different sports represented</p>
        </div>
        <div className="insight-card">
          <h3>Average Age</h3>
          <p className="insight-value">{kpiData.avgAge}</p>
          <p className="insight-description">Years old on average</p>
        </div>
        <div className="insight-card">
          <h3>Female Participation</h3>
          <p className="insight-value">{kpiData.femaleParticipation}%</p>
          <p className="insight-description">Gender representation</p>
        </div>
        <div className="insight-card">
          <h3>Total Athletes</h3>
          <p className="insight-value">{kpiData.totalAthletes?.toLocaleString() || '0'}</p>
          <p className="insight-description">Across all sports</p>
        </div>
      </div>
    </div>
  )
}

export default Sports
