import React, { useState, useEffect } from 'react'
import SunburstChart from '../visuals/SunburstChart'
import ScatterPlot from '../visuals/ScatterPlot'
import MultiLineChart from '../visuals/MultiLineChart'
import ViolinPlot from '../visuals/ViolinPlot'
import ClusteredBarChart from '../visuals/ClusteredBarChart'
import InteractiveSportChart from '../visuals/InteractiveSportChart'
import MedalTrendsChart from '../visuals/MedalTrendsChart'
import MedalHeatmap from '../visuals/MedalHeatmap'
import Filters from '../components/Filters'
import FilterSummary from '../components/FilterSummary'
import UsageGuide from '../components/UsageGuide'
import ErrorBoundary from '../components/ErrorBoundary'

// Import data directly
import sportsData from '../data/sports_demographics.json'
import athleteData from '../data/athletes_over_time.json'
import genderData from '../data/gender_participation.json'
import decoratedAthletes from '../data/decorated_athletes.json'
import agePerformanceData from '../data/age_performance_analysis.json'
import medalsBySportCountry from '../data/medals_by_sport_country.json'
import medalsBySportCountryYear from '../data/medals_by_sport_country_year.json'

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
  
  const [ageGroupData, setAgeGroupData] = useState([])
  const [decoratedAthletesData, setDecoratedAthletesData] = useState([])
  const [filteredMedalData, setFilteredMedalData] = useState([])
  const [filteredTrendData, setFilteredTrendData] = useState([])

  useEffect(() => {
    console.log('Loading Sports data...', { 
      sportsData: sportsData.length, 
      athleteData: athleteData.length,
      genderData: genderData.length,
      decoratedAthletes: decoratedAthletes.length,
      agePerformanceData: agePerformanceData.length,
      medalsBySportCountry: medalsBySportCountry.length,
      medalsBySportCountryYear: medalsBySportCountryYear.length
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

    // Set decorated athletes data for Q3
    setDecoratedAthletesData(decoratedAthletes)

    // Process age group data for Q2 and Q7
    setAgeGroupData(agePerformanceData)

    // Initialize filtered data
    setFilteredMedalData(medalsBySportCountry)
    setFilteredTrendData(medalsBySportCountryYear)
  }, [])

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    console.log('Applied filters:', newFilters)

    // Filter medal data by sport and country
    let filteredMedals = [...medalsBySportCountry]
    let filteredTrends = [...medalsBySportCountryYear]

    // Apply sport filter
    if (newFilters.sports && newFilters.sports.length > 0) {
      filteredMedals = filteredMedals.filter(item => 
        newFilters.sports.includes(item.sport)
      )
      filteredTrends = filteredTrends.filter(item => 
        newFilters.sports.includes(item.sport)
      )
    }

    // Apply country filter
    if (newFilters.countries && newFilters.countries.length > 0) {
      filteredMedals = filteredMedals.filter(item => 
        newFilters.countries.includes(item.country)
      )
      filteredTrends = filteredTrends.filter(item => 
        newFilters.countries.includes(item.country)
      )
    }

    // Apply year filter for trends
    if (newFilters.years && newFilters.years.length === 2) {
      filteredTrends = filteredTrends.filter(item => 
        item.year >= newFilters.years[0] && item.year <= newFilters.years[1]
      )
    }

    setFilteredMedalData(filteredMedals)
    setFilteredTrendData(filteredTrends)
    
    console.log('Filtered data:', { 
      medals: filteredMedals.length, 
      trends: filteredTrends.length 
    })
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

      {/* Usage Guide */}
      <UsageGuide />

      {/* Filter Summary */}
      <FilterSummary 
        filters={filters} 
        dataCount={filteredMedalData.length}
        title="Interactive Filter Results"
      />

      {/* Interactive Filtering Section */}
      <div className="section-header">
        <h2>🎯 Interactive Medal Analysis</h2>
        <p>Use the filters above to explore medal distribution by specific countries and sports. Real-time filtering applied!</p>
      </div>

      {/* Medal Distribution by Country and Sport - Interactive Bar Chart */}
      <div className="chart-container">
        <h2 className="chart-title">🏆 Medal Distribution by Selected Country & Sport</h2>
        <p className="chart-description">
          <strong>Interactive Analysis:</strong> This chart shows medal counts for your selected countries and sports. 
          Try selecting "USA" + "Swimming" or "Great Britain" + "Cycling" to see specific combinations.
          Each bar represents total medals won by that country in that sport.
        </p>
        <ErrorBoundary>
          <InteractiveSportChart 
            data={filteredMedalData} 
            width={900} 
            height={500}
            title="Medal Distribution by Country and Sport"
          />
        </ErrorBoundary>
        <div className="chart-insight">
          💡 <strong>Current Selection:</strong> Showing {filteredMedalData.length} country-sport combinations.
          {filters.countries.length > 0 && (
            <span> Countries: {filters.countries.join(', ')}.</span>
          )}
          {filters.sports.length > 0 && (
            <span> Sports: {filters.sports.join(', ')}.</span>
          )}
          {filteredMedalData.length === 0 && (
            <span className="text-warning"> No data matches your current filters. Try selecting different countries or sports above.</span>
          )}
        </div>
      </div>

      {/* Medal Trends Over Time */}
      <div className="chart-container">
        <h2 className="chart-title">📈 Medal Trends Over Time (1996-2016)</h2>
        <p className="chart-description">
          <strong>Historical Performance:</strong> Track how your selected countries performed in chosen sports over recent Olympics.
          Each line represents a country-sport combination showing medal progression over time.
        </p>
        <ErrorBoundary>
          <MedalTrendsChart 
            data={filteredTrendData} 
            width={900} 
            height={500}
            title="Medal Performance Trends by Country and Sport"
          />
        </ErrorBoundary>
        <div className="chart-insight">
          💡 <strong>Trend Analysis:</strong> Showing {filteredTrendData.length} data points across {filters.years ? `${filters.years[0]}-${filters.years[1]}` : '1996-2016'}.
          Look for rising trends (improving performance) vs declining trends (decreasing competitiveness).
        </div>
      </div>

      {/* Heatmap Overview */}
      <div className="chart-container">
        <h2 className="chart-title">🔥 Medal Intensity Heatmap</h2>
        <p className="chart-description">
          <strong>Dominance Patterns:</strong> This heatmap reveals which countries dominate specific sports. 
          Darker colors indicate higher medal counts. Perfect for identifying specialization patterns.
        </p>
        <ErrorBoundary>
          <MedalHeatmap 
            data={filteredMedalData} 
            width={900} 
            height={600}
            title="Country-Sport Medal Intensity Matrix"
          />
        </ErrorBoundary>
        <div className="chart-insight">
          💡 <strong>Pattern Recognition:</strong> Red/Orange cells show traditional strengths (e.g., USA in Swimming, Italy in Fencing).
          Use this to identify emerging opportunities or historical dominance patterns.
        </div>
      </div>

      {/* General Sports Analysis Section */}
      <div className="section-header">
        <h2>📊 General Sports Demographics & Trends</h2>
        <p>Comprehensive analysis of sports characteristics, athlete demographics, and participation patterns</p>
      </div>

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

      {/* Q2: Age Groups Excel in Specific Sports */}
      <div className="chart-container">
        <h2 className="chart-title">🎯 Age Groups Excellence by Sport</h2>
        <p className="chart-description">
          <strong>Question:</strong> Which age groups excel in specific sports and what are their success rates?
        </p>
        <ErrorBoundary>
          <ClusteredBarChart 
            data={ageGroupData.map(d => ({
              category: d.sport,
              subcategory: d.age_group,
              value: d.success_rate,
              description: `${d.medals_won} medals from ${d.athletes} athletes`
            }))}
            width={900} 
            height={500}
            title="Success Rate by Age Group and Sport"
          />
        </ErrorBoundary>
        <div className="chart-insight">
          💡 <strong>Key Insight:</strong> Gymnastics peaks at 15-20 years (24.7% success rate), 
          while endurance sports like Cycling peak later at 26-30 years (20% success rate).
        </div>
      </div>

      {/* Q3: Most Decorated Athletes by Sport */}
      <div className="chart-container">
        <h2 className="chart-title">🏅 Most Decorated Athletes by Sport</h2>
        <p className="chart-description">
          <strong>Question:</strong> Who are the most decorated athletes in each sport, particularly Swimming?
        </p>
        <ErrorBoundary>
          <ScatterPlot 
            data={decoratedAthletesData.map(d => ({
              x: d.age_first_medal,
              y: d.total_medals,
              size: d.gold_medals * 3 + d.silver_medals * 2 + d.bronze_medals,
              name: d.athlete,
              sport: d.sport,
              category: d.sport
            }))}
            width={800} 
            height={500}
            title="Career Timeline: Age at First Medal vs Total Medals"
          />
        </ErrorBoundary>
        <div className="chart-insight">
          💡 <strong>Key Insight:</strong> Michael Phelps dominates swimming with 28 total medals. 
          Early starters (age 15-19) in gymnastics often achieve remarkable success, while endurance sports favor later peaks.
        </div>
      </div>

      {/* Q7: Age Group Success Ratio Analysis */}
      <div className="chart-container">
        <h2 className="chart-title">📊 Age Group Medal Success Analysis</h2>
        <p className="chart-description">
          <strong>Question:</strong> Which age group has the highest medal success ratio historically across all sports?
        </p>
        <ErrorBoundary>
          <ViolinPlot 
            data={ageGroupData.flatMap(d => 
              Array(Math.round(d.athletes / 10)).fill().map(() => ({
                sport: d.sport,
                age: d.avg_age + (Math.random() - 0.5) * 4, // Add some distribution
                success_rate: d.success_rate
              }))
            )}
            width={900} 
            height={500}
            title="Age Distribution and Performance by Sport"
          />
        </ErrorBoundary>
        <div className="chart-insight">
          💡 <strong>Key Insight:</strong> The 21-25 age group shows the highest overall success rates across multiple sports. 
          Early specialization sports (gymnastics) peak younger, while technical sports peak in the mid-20s.
        </div>
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
