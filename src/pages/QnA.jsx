import React, { useState, useEffect } from 'react'
import BarChart from '../visuals/BarChart'
import LineChart from '../visuals/LineChart'
import ScatterPlot from '../visuals/ScatterPlot'
import BubbleChart from '../visuals/BubbleChart'
import MultiLineChart from '../visuals/MultiLineChart'
import ErrorBoundary from '../components/ErrorBoundary'

// Import data directly for now
import medalsData from '../data/medal_counts_by_country.json'
import athleteData from '../data/athletes_over_time.json'
import genderData from '../data/gender_participation.json'
import sportsData from '../data/medals_by_sport.json'
import sportsDemographics from '../data/sports_demographics.json'

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
      data: genderData.filter(d => d.gender === 'Female'),
      chartProps: { xField: 'year', yField: 'count', title: 'Female Olympic Participation Over Time' }
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
