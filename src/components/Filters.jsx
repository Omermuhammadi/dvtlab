import React, { useState, useEffect } from 'react'
import './Filters.css'

function Filters({ onFiltersChange, data, showAdvanced = false }) {
  const [selectedCountries, setSelectedCountries] = useState([])
  const [selectedYears, setSelectedYears] = useState([1980, 2020])
  const [selectedSeason, setSelectedSeason] = useState('all')
  const [selectedMedals, setSelectedMedals] = useState([])
  const [selectedSports, setSelectedSports] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  // Extract unique values from data
  const [countries, setCountries] = useState([])
  const [sports, setSports] = useState([])
  const [years, setYears] = useState({ min: 1896, max: 2020 })

  useEffect(() => {
    if (data && data.length > 0) {
      const uniqueCountries = [...new Set(data.map(d => d.country).filter(Boolean))]
      const uniqueSports = [...new Set(data.map(d => d.sport).filter(Boolean))]
      const yearValues = data.map(d => d.year).filter(Boolean)
      
      setCountries(uniqueCountries.slice(0, 20)) // Top 20 countries
      setSports(uniqueSports.slice(0, 15)) // Top 15 sports
      setYears({
        min: Math.min(...yearValues),
        max: Math.max(...yearValues)
      })
    }
  }, [data])

  const handleCountryChange = (country) => {
    const newCountries = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country]
    
    setSelectedCountries(newCountries)
    updateFilters({ countries: newCountries })
  }

  const handleSportChange = (sport) => {
    const newSports = selectedSports.includes(sport)
      ? selectedSports.filter(s => s !== sport)
      : [...selectedSports, sport]
    
    setSelectedSports(newSports)
    updateFilters({ sports: newSports })
  }

  const handleMedalChange = (medal) => {
    const newMedals = selectedMedals.includes(medal)
      ? selectedMedals.filter(m => m !== medal)
      : [...selectedMedals, medal]
    
    setSelectedMedals(newMedals)
    updateFilters({ medals: newMedals })
  }

  const handleYearChange = (e) => {
    const value = [years.min, parseInt(e.target.value)]
    setSelectedYears(value)
    updateFilters({ years: value })
  }

  const handleSeasonChange = (e) => {
    setSelectedSeason(e.target.value)
    updateFilters({ season: e.target.value })
  }

  const updateFilters = (newFilter) => {
    const filters = {
      countries: selectedCountries,
      years: selectedYears,
      season: selectedSeason,
      medals: selectedMedals,
      sports: selectedSports,
      ...newFilter
    }
    onFiltersChange(filters)
  }

  const clearFilters = () => {
    setSelectedCountries([])
    setSelectedYears([years.min, years.max])
    setSelectedSeason('all')
    setSelectedMedals([])
    setSelectedSports([])
    onFiltersChange({
      countries: [],
      years: [years.min, years.max],
      season: 'all',
      medals: [],
      sports: []
    })
  }

  const removeFilter = (type, value) => {
    switch (type) {
      case 'country':
        handleCountryChange(value)
        break
      case 'sport':
        handleSportChange(value)
        break
      case 'medal':
        handleMedalChange(value)
        break
      default:
        break
    }
  }

  const getActiveFiltersCount = () => {
    return selectedCountries.length + selectedSports.length + selectedMedals.length + 
           (selectedSeason !== 'all' ? 1 : 0)
  }

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3>🔍 Data Filters</h3>
        <div className="filters-actions">
          <span className="filters-count">
            {getActiveFiltersCount()} active filter{getActiveFiltersCount() !== 1 ? 's' : ''}
          </span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="expand-btn"
          >
            {isExpanded ? 'Less' : 'More'} Filters
          </button>
          <button onClick={clearFilters} className="clear-btn">Clear All</button>
        </div>
      </div>
      
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">Year Range</label>
          <input 
            type="range" 
            min={years.min} 
            max={years.max} 
            value={selectedYears[1]}
            onChange={handleYearChange}
            className="year-slider"
          />
          <span className="year-display">{selectedYears[0]} - {selectedYears[1]}</span>
        </div>

        <div className="filter-group">
          <label className="filter-label">Season</label>
          <select value={selectedSeason} onChange={handleSeasonChange}>
            <option value="all">All Seasons</option>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Medal Types</label>
          <div className="multi-select">
            {['Gold', 'Silver', 'Bronze'].map(medal => (
              <label key={medal} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedMedals.includes(medal.toLowerCase())}
                  onChange={() => handleMedalChange(medal.toLowerCase())}
                />
                <span className="checkbox-text">{medal}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Countries ({selectedCountries.length}/20)</label>
          <div className="country-checkboxes scrollable">
            {countries.map(country => (
              <label key={country} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(country)}
                  onChange={() => handleCountryChange(country)}
                />
                <span className="checkbox-text">{country}</span>
              </label>
            ))}
          </div>
        </div>

        {(isExpanded || showAdvanced) && (
          <div className="filter-group">
            <label className="filter-label">Sports ({selectedSports.length}/15)</label>
            <div className="sport-checkboxes scrollable">
              {sports.map(sport => (
                <label key={sport} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedSports.includes(sport)}
                    onChange={() => handleSportChange(sport)}
                  />
                  <span className="checkbox-text">{sport}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {getActiveFiltersCount() > 0 && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters: </span>
          
          {selectedCountries.map(country => (
            <span key={`country-${country}`} className="filter-tag">
              🏁 {country}
              <button onClick={() => removeFilter('country', country)}>×</button>
            </span>
          ))}
          
          {selectedSports.map(sport => (
            <span key={`sport-${sport}`} className="filter-tag">
              🏃 {sport}
              <button onClick={() => removeFilter('sport', sport)}>×</button>
            </span>
          ))}
          
          {selectedMedals.map(medal => (
            <span key={`medal-${medal}`} className="filter-tag">
              🏆 {medal}
              <button onClick={() => removeFilter('medal', medal)}>×</button>
            </span>
          ))}
          
          {selectedSeason !== 'all' && (
            <span className="filter-tag">
              ❄️ {selectedSeason}
              <button onClick={() => handleSeasonChange({target: {value: 'all'}})}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Filters
