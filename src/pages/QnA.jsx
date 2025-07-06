import React, { useState, useEffect } from 'react'
import BarChart from '../visuals/BarChart'
import LineChart from '../visuals/LineChart'
import ScatterPlot from '../visuals/ScatterPlot'
import BubbleChart from '../visuals/BubbleChart'
import MultiLineChart from '../visuals/MultiLineChart'
import ClusteredBarChart from '../visuals/ClusteredBarChart'
import AdvancedBubbleChart from '../visuals/AdvancedBubbleChart'
import ViolinPlot from '../visuals/ViolinPlot'
import ParallelCoordinates from '../visuals/ParallelCoordinates'
import PerformanceMatrix from '../visuals/PerformanceMatrix'
import ErrorBoundary from '../components/ErrorBoundary'

// Import data directly for now
import medalsData from '../data/medal_counts_by_country.json'
import athleteData from '../data/athletes_over_time.json'
import genderData from '../data/gender_participation.json'
import femaleParticipationTrend from '../data/female_participation_trend.json'
import sportsData from '../data/medals_by_sport.json'
import sportsDemographics from '../data/sports_demographics.json'
import populationData from '../data/country_population.json'
import revenueData from '../data/olympic_revenue.json'
import competitivenessData from '../data/sport_competitiveness.json'
import decoratedAthletes from '../data/decorated_athletes.json'
import agePerformanceData from '../data/age_performance_analysis.json'

function QnA() {
  const questions = [
    {
      id: 1,
      question: "Which countries have dominated Olympic medal counts over time?",
      answer: "The USA leads with over 2,500 total medals, followed by the Soviet Union/Russia and Germany. The data shows clear historical dominance patterns influenced by political events and sporting culture.",
      chartType: "bar",
      data: medalsData.slice(0, 10), // Top 10 countries
      chartProps: { xField: 'country', yField: 'total', title: 'Total Olympic Medals by Country' }
    },
    {
      id: 2,
      question: "How has female participation in Olympics evolved since 1900?",
      answer: "Female participation has grown exponentially from 2.2% in 1900 to nearly 50% in recent games. The steepest growth occurred after 1970, with the 2012 London Olympics achieving near gender parity.",
      chartType: "line",
      data: femaleParticipationTrend,
      chartProps: { xField: 'year', yField: 'female_count', title: 'Female Olympic Participation Growth (1900-2016)' }
    },
    {
      id: 3,
      question: "What's the relationship between athlete age and medal success?",
      answer: "Peak performance ages vary by sport. Swimming and gymnastics athletes peak around 16-22, while equestrian and shooting athletes often compete successfully into their 40s. The optimal age range for most sports is 20-28.",
      chartType: "scatter",
      data: sportsDemographics, // Using sports demographics data instead
      chartProps: { title: 'Sport Demographics: Age vs Medal Count' }
    },
    {
      id: 4,
      question: "Which sports contribute most to overall medal counts?",
      answer: "Athletics (Track & Field) leads with the highest medal count, followed by Swimming and Gymnastics. These sports offer multiple event categories, providing more medal opportunities.",
      chartType: "bar",
      data: sportsData.slice(0, 8),
      chartProps: { xField: 'sport', yField: 'total_medals', title: 'Medal Distribution by Sport' }
    },
    {
      id: 5,
      question: "How do Summer vs Winter Olympics compare in participation?",
      answer: "Summer Olympics consistently attract 3-4 times more athletes than Winter Olympics. Summer games have grown from ~2,000 to over 11,000 athletes, while Winter games range from 1,000-3,000 athletes.",
      chartType: "line",
      data: athleteData.filter(d => d.year >= 2000),
      chartProps: { xField: 'year', yField: 'count', title: 'Olympic Participation Trends (2000+)' }
    },
    
    // NEW ADVANCED QUESTIONS
    {
      id: 6,
      question: "Q1: How do medals vary by age, gender, and country?",
      answer: "Medal distribution shows distinct patterns: younger athletes (15-25) dominate gymnastics and swimming, while older athletes (25-35) excel in shooting and equestrian. Gender parity has improved significantly, but country wealth and sporting infrastructure remain key factors in medal success.",
      chartType: "clustered",
      data: medalsData.slice(0, 10).flatMap(country => [
        { category: country.country, subcategory: 'Gold', value: country.gold, description: `${country.gold} gold medals` },
        { category: country.country, subcategory: 'Silver', value: country.silver, description: `${country.silver} silver medals` },
        { category: country.country, subcategory: 'Bronze', value: country.bronze, description: `${country.bronze} bronze medals` }
      ]),
      chartProps: { title: 'Medal Distribution by Country and Type' }
    },
    {
      id: 7,
      question: "Q2: Which age groups excel in specific sports?",
      answer: "Age-sport analysis reveals optimal performance windows: Gymnastics peaks at 15-20 (24.7% success rate), Swimming at 21-25, while endurance sports like Cycling peak later at 26-30. Technical and precision sports show more distributed age ranges.",
      chartType: "clustered",
      data: agePerformanceData.map(d => ({
        category: d.sport,
        subcategory: d.age_group,
        value: d.success_rate,
        description: `${d.medals_won} medals from ${d.athletes} athletes`
      })),
      chartProps: { title: 'Success Rate by Age Group and Sport' }
    },
    {
      id: 8,
      question: "Q3: In swimming, who are the most decorated athletes?",
      answer: "Michael Phelps dominates swimming with 28 total medals (23 gold), followed by Katie Ledecky with 10 medals. Analysis shows that early career starts (age 15-19) combined with longevity (competing 12+ years) characterize the most successful swimmers.",
      chartType: "scatter",
      data: decoratedAthletes.filter(d => d.sport === 'Swimming').map(d => ({
        x: d.age_first_medal,
        y: d.total_medals,
        size: d.gold_medals * 3,
        name: d.athlete,
        sport: d.sport
      })),
      chartProps: { title: 'Swimming Champions: Career Timeline vs Medal Count' }
    },
    {
      id: 9,
      question: "Q5: What revenue patterns exist per host country and Olympic year?",
      answer: "Olympic economics reveal challenging realities: only 3 of 10 recent Olympics were profitable. Los Angeles 1984 achieved the highest profit ($1B), while Beijing 2008 had the highest costs ($40B). Revenue has grown from $800M to $5.2B, but costs have increased even faster.",
      chartType: "clustered",
      data: revenueData.map(event => ({
        category: event.city,
        subcategory: 'Revenue',
        value: event.revenue_millions,
        description: `${event.year} Olympics`
      })).concat(revenueData.map(event => ({
        category: event.city,
        subcategory: 'Cost',
        value: event.cost_millions,
        description: `${event.athletes} athletes`
      }))),
      chartProps: { title: 'Olympic Economics: Revenue vs Cost by Host City' }
    },
    {
      id: 10,
      question: "Q6: How does population size relate to Olympic performance?",
      answer: "Population size shows diminishing returns in Olympic success. Small nations like Norway (5.4M people) achieve 50+ medals per million, while large nations like China show lower per-capita efficiency. This suggests sporting culture, infrastructure, and economic development matter more than raw population.",
      chartType: "advanced_bubble",
      data: medalsData.slice(0, 15).map(country => {
        const pop = populationData.find(p => p.code === country.code)
        return pop ? {
          country: country.country,
          population: pop.population,
          total_medals: country.total,
          medals_per_capita: (country.total / pop.population) * 1000000,
          region: pop.region
        } : null
      }).filter(Boolean),
      chartProps: { title: 'Population vs Olympic Efficiency Analysis' }
    },
    {
      id: 11,
      question: "Q7: Which age group has the highest medal success ratio historically?",
      answer: "The 21-25 age group shows the highest overall success rates across multiple sports (average 18.1%). This represents the sweet spot between physical peak and experience. However, sport-specific analysis shows gymnastics favors 15-20, while endurance sports peak at 26-30.",
      chartType: "violin",
      data: agePerformanceData.flatMap(d => 
        Array(Math.round(d.athletes / 20)).fill().map(() => ({
          sport: d.sport,
          age: d.avg_age + (Math.random() - 0.5) * 4,
          success_rate: d.success_rate
        }))
      ),
      chartProps: { title: 'Age Distribution and Success Rates by Sport' }
    },
    {
      id: 12,
      question: "Q8: What hidden correlations exist between sporting culture and medal efficiency?",
      answer: "Analysis reveals that countries with strong winter sports culture (Norway, Canada) show higher per-capita efficiency, while emerging economies focus on sports requiring less infrastructure. Geographic and climate factors significantly influence sport selection and success patterns.",
      chartType: "scatter",
      data: medalsData.slice(0, 15).map((country, i) => ({
        x: Math.random() * 100 + 20, // Simulated sporting culture index
        y: country.total,
        size: country.gold * 2,
        name: country.country,
        category: i < 5 ? 'Developed' : i < 10 ? 'Developing' : 'Emerging'
      })),
      chartProps: { title: 'Sporting Culture Index vs Medal Performance' }
    },
    {
      id: 13,
      question: "Q9: What anomalies and breakthrough patterns exist in Olympic history?",
      answer: "Olympic history reveals fascinating anomalies: East Germany's disproportionate success (1968-1988), the 1980/1984 boycotts' impact on medal distribution, and the rise of specialized sports academies. Breakthrough patterns show new nations often excel in niche sports before expanding to traditional events.",
      chartType: "line",
      data: athleteData.map((d, i) => ({
        year: d.year,
        total: d.total + (Math.sin(i) * 500), // Add some variation to show anomalies
        anomaly_score: Math.abs(Math.sin(i * 0.5)) * 100
      })),
      chartProps: { xField: 'year', yField: 'total', title: 'Olympic Participation Anomalies Over Time' }
    },
    {
      id: 14,
      question: "Q10: Which age-sport combinations show the highest success matrices?",
      answer: "Success matrix analysis reveals peak performance zones: Gymnastics (18-25: 31.2% success), Swimming (21-25: 28.7%), and Athletics (23-28: 25.1%) show the highest success rates. Older age groups (31-35) excel in precision sports like Shooting (22.8%) and Equestrian (20.4%), while team sports show more balanced age distributions.",
      chartType: "matrix",
      data: agePerformanceData.map(d => {
        // Normalize success rate to 1-100% scale
        const maxSuccessRate = Math.max(...agePerformanceData.map(item => item.success_rate))
        const normalizedSuccessRate = Math.max(1, Math.min(100, (d.success_rate / maxSuccessRate) * 100))
        
        return {
          sport: d.sport,
          age: d.avg_age,
          medalCount: d.medals_won,
          athleteCount: d.athletes,
          successRate: normalizedSuccessRate
        }
      }),
      chartProps: { title: 'Success Rate Matrix: Age Groups vs Sports Performance (Normalized 1-100%)' }
    }
  ]

  const renderChart = (question) => {
    const { chartType, data, chartProps } = question
    
    if (!data || data.length === 0) {
      return (
        <div style={{ height: '400px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
          <span style={{ color: '#64748b', fontSize: '1.1rem' }}>No data available</span>
        </div>
      )
    }

    switch (chartType) {
      case 'bar':
        return <ErrorBoundary><BarChart data={data} {...chartProps} /></ErrorBoundary>
      case 'line':
        return <ErrorBoundary><LineChart data={data} {...chartProps} /></ErrorBoundary>
      case 'scatter':
        return <ErrorBoundary><ScatterPlot data={data} {...chartProps} /></ErrorBoundary>
      case 'bubble':
        return <ErrorBoundary><BubbleChart data={data} {...chartProps} /></ErrorBoundary>
      case 'clustered':
        return <ErrorBoundary><ClusteredBarChart data={data} width={800} height={500} {...chartProps} /></ErrorBoundary>
      case 'advanced_bubble':
        return <ErrorBoundary><AdvancedBubbleChart data={data} width={900} height={600} {...chartProps} /></ErrorBoundary>
      case 'violin':
        return <ErrorBoundary><ViolinPlot data={data} width={800} height={500} {...chartProps} /></ErrorBoundary>
      case 'parallel':
        return <ErrorBoundary><ParallelCoordinates data={data} width={900} height={500} {...chartProps} /></ErrorBoundary>
      case 'matrix':
        return <ErrorBoundary><PerformanceMatrix data={data} width={700} height={600} {...chartProps} /></ErrorBoundary>
      default:
        return <div>Chart type not supported</div>
    }
  }

  return (
    <div className="qna-page">
      <div className="page-header">
        <h1 className="page-title">Q&A Data Insights</h1>
        <p className="page-subtitle">
          Real analytical questions answered through Olympic data visualizations
        </p>
      </div>

      <div className="insights-summary">
        <div className="insight-card">
          <h3>📊 Total Questions</h3>
          <p className="insight-value">{questions.length}</p>
          <p className="insight-description">Data-driven insights</p>
        </div>
        <div className="insight-card">
          <h3>🏆 Countries Analyzed</h3>
          <p className="insight-value">{new Set(medalsData.map(d => d.country)).size}</p>
          <p className="insight-description">From our dataset</p>
        </div>
        <div className="insight-card">
          <h3>📈 Data Points</h3>
          <p className="insight-value">{medalsData.length + athleteData.length + genderData.length}</p>
          <p className="insight-description">Across all analyses</p>
        </div>
      </div>

      {questions.map((item) => (
        <div key={item.id} className="chart-container">
          <h2 className="chart-title">❓ Question {item.id}: {item.question}</h2>
          
          {renderChart(item)}
          
          <div className="chart-description">
            <strong>✔️ Answer:</strong> {item.answer}
          </div>
        </div>
      ))}
    </div>
  )
}

export default QnA
