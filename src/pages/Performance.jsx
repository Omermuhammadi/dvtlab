import React, { useState, useEffect } from 'react'
import StackedBarChart from '../visuals/StackedBarChart'
import BubbleChart from '../visuals/BubbleChart'
import HeatmapChart from '../visuals/HeatmapChart'
import ClusteredBarChart from '../visuals/ClusteredBarChart'
import AdvancedBubbleChart from '../visuals/AdvancedBubbleChart'
import Filters from '../components/Filters'
import ErrorBoundary from '../components/ErrorBoundary'
import medalData from '../data/medal_counts_by_country.json'
import populationData from '../data/country_population.json'
import revenueData from '../data/olympic_revenue.json'
import competitivenessData from '../data/sport_competitiveness.json'

function Performance() {
  const [countryData, setCountryData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [populationMedalData, setPopulationMedalData] = useState([])
  const [competitivenessChartData, setCompetitivenessChartData] = useState([])
  const [revenueChartData, setRevenueChartData] = useState([])

  useEffect(() => {
    // Load top 20 countries for better visualization
    const topCountries = medalData.slice(0, 20)
    setCountryData(topCountries)
    setFilteredData(topCountries)

    // Create population vs medal data for advanced bubble chart
    const populationMedalAnalysis = topCountries.map(country => {
      const populationInfo = populationData.find(p => p.code === country.code) || 
                           populationData.find(p => p.country === country.country)
      
      if (populationInfo) {
        return {
          country: country.country,
          code: country.code,
          population: populationInfo.population,
          total_medals: country.total,
          medals_per_capita: (country.total / populationInfo.population) * 1000000,
          region: populationInfo.region,
          gold: country.gold,
          silver: country.silver,
          bronze: country.bronze
        }
      }
      return null
    }).filter(Boolean)

    setPopulationMedalData(populationMedalAnalysis)

    // Create competitiveness chart data
    const competitivenessFormatted = competitivenessData.map(sport => ({
      category: sport.sport,
      subcategory: 'Events',
      value: sport.events,
      description: `${sport.total_medals} total medals available`
    })).concat(competitivenessData.map(sport => ({
      category: sport.sport,
      subcategory: 'Viewership',
      value: sport.tv_viewership_millions,
      description: `${sport.global_popularity}% global popularity`
    })))

    setCompetitivenessChartData(competitivenessFormatted)

    // Create revenue chart data
    const revenueFormatted = revenueData.map(event => ({
      category: event.city,
      subcategory: 'Revenue',
      value: event.revenue_millions,
      description: `${event.year} Olympics`
    })).concat(revenueData.map(event => ({
      category: event.city,
      subcategory: 'Cost',
      value: event.cost_millions,
      description: `${event.athletes} athletes`
    })))

    setRevenueChartData(revenueFormatted)

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

      {/* Q6: Population vs Performance Analysis */}
      <div className="chart-container">
        <h2 className="chart-title">🌍 Population vs Olympic Performance</h2>
        <p className="chart-description">
          <strong>Question:</strong> How does population size relate to sports performance and medal counts?
        </p>
        <ErrorBoundary>
          <AdvancedBubbleChart 
            data={populationMedalData} 
            width={900} 
            height={600}
            title="Medals per Million People vs Total Population"
          />
        </ErrorBoundary>
        <div className="chart-insight">
          💡 <strong>Key Insight:</strong> Smaller countries often have higher medals per capita. 
          Countries like Norway and Australia achieve exceptional efficiency with {populationMedalData.length > 0 ? 
            populationMedalData.filter(d => d.medals_per_capita > 50).length : 0} countries 
          exceeding 50 medals per million people.
        </div>
      </div>

      {/* Q4: Most Competitive Sports */}
      <div className="chart-container">
        <h2 className="chart-title">🔥 Most Competitive Sports Analysis</h2>
        <p className="chart-description">
          <strong>Question:</strong> What are the most competitive sports by number of events and global viewership?
        </p>
        <ErrorBoundary>
          <ClusteredBarChart 
            data={competitivenessChartData} 
            width={900} 
            height={500}
            title="Sport Competitiveness: Events vs Viewership"
          />
        </ErrorBoundary>
        <div className="chart-insight">
          💡 <strong>Key Insight:</strong> Athletics and Swimming lead in both event count and viewership. 
          Football has the highest viewership despite fewer events, while Athletics offers the most medal opportunities.
        </div>
      </div>

      {/* Q5: Olympic Revenue Analysis */}
      <div className="chart-container">
        <h2 className="chart-title">💰 Olympic Revenue vs Cost Analysis</h2>
        <p className="chart-description">
          <strong>Question:</strong> What revenue patterns exist per host city and how do costs compare?
        </p>
        <ErrorBoundary>
          <ClusteredBarChart 
            data={revenueChartData} 
            width={900} 
            height={500}
            title="Olympic Economics: Revenue vs Cost by Host City"
          />
        </ErrorBoundary>
        <div className="chart-insight">
          💡 <strong>Key Insight:</strong> Only {revenueData.filter(d => d.profit_loss > 0).length} out of {revenueData.length} 
          recent Olympics were profitable. Los Angeles 1984 was the most profitable, while Beijing 2008 had the highest costs.
        </div>
      </div>

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
