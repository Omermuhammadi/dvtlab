import React, { useState, useEffect } from 'react'
import medalData from '../data/medal_counts_by_country.json'
import athleteData from '../data/athletes_over_time.json'

function TestOverview() {
  const [data, setData] = useState(null)

  useEffect(() => {
    console.log('Medal Data:', medalData.slice(0, 3))
    console.log('Athlete Data:', athleteData.slice(0, 3))
    setData({ medals: medalData.length, athletes: athleteData.length })
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div style={{ padding: '20px' }}>
      <h1>Data Test</h1>
      <p>Medal data entries: {data.medals}</p>
      <p>Athlete data entries: {data.athletes}</p>
      <div>
        <h2>Sample Medal Data:</h2>
        <pre>{JSON.stringify(medalData.slice(0, 2), null, 2)}</pre>
      </div>
      <div>
        <h2>Sample Athlete Data:</h2>
        <pre>{JSON.stringify(athleteData.slice(0, 2), null, 2)}</pre>
      </div>
    </div>
  )
}

export default TestOverview
