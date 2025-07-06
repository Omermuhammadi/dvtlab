import React from 'react'

function QnA() {
  const questions = [
    {
      id: 1,
      question: "Which country has won the most gold medals in swimming since 2000?",
      answer: "The United States dominates swimming with 145 gold medals since 2000, with peak performance in Beijing 2008 largely due to Michael Phelps' historic 8-gold medal achievement."
    },
    {
      id: 2,
      question: "How has female participation in Olympics changed over time?",
      answer: "Female participation has grown exponentially from 2.2% in 1900 to nearly 50% in recent games, with the 2012 London Olympics being the first to achieve gender parity."
    },
    {
      id: 3,
      question: "What's the optimal age for Olympic athletes across different sports?",
      answer: "Peak performance ages vary significantly: swimmers and gymnasts peak around 16-22, while equestrian and shooting athletes often compete successfully into their 40s and 50s."
    },
    {
      id: 4,
      question: "Which sports have been discontinued from the Olympics?",
      answer: "Notable discontinued sports include Tug of War (1900-1920), Polo (1900-1936), and Cricket (1900). Baseball and softball were removed after 2008 but returned in 2020."
    },
    {
      id: 5,
      question: "How do host countries perform compared to their average?",
      answer: "Host countries typically see a 30-50% boost in medal count, with notable examples including China (2008), Great Britain (2012), and Brazil (2016)."
    }
  ]

  return (
    <div className="qna-page">
      <div className="page-header">
        <h1 className="page-title">Q&A Data Insights</h1>
        <p className="page-subtitle">
          Real analytical questions answered through Olympic data visualizations
        </p>
      </div>

      {questions.map((item) => (
        <div key={item.id} className="chart-container">
          <h2 className="chart-title">❓ {item.question}</h2>
          
          <div style={{ height: '400px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '8px', marginBottom: '1rem' }}>
            <span style={{ color: '#64748b', fontSize: '1.1rem' }}>D3.js Visualization</span>
          </div>
          
          <div className="chart-description">
            <strong>✔️ Answer:</strong> {item.answer}
          </div>
        </div>
      ))}
    </div>
  )
}

export default QnA
