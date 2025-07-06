import React from 'react'

const FilterSummary = ({ filters, dataCount, title = "Current Selection" }) => {
  const hasFilters = filters.countries?.length > 0 || filters.sports?.length > 0 || 
                    filters.years?.length > 0 || filters.medals?.length > 0

  if (!hasFilters) {
    return (
      <div className="filter-summary">
        <div className="filter-summary-content">
          <h3>🎯 {title}</h3>
          <p>No filters applied - showing all data ({dataCount} items)</p>
        </div>
      </div>
    )
  }

  return (
    <div className="filter-summary">
      <div className="filter-summary-content">
        <h3>🎯 {title}</h3>
        <div className="filter-tags">
          {filters.countries?.length > 0 && (
            <div className="filter-tag">
              <span className="filter-label">Countries:</span>
              <span className="filter-values">{filters.countries.join(', ')}</span>
            </div>
          )}
          {filters.sports?.length > 0 && (
            <div className="filter-tag">
              <span className="filter-label">Sports:</span>
              <span className="filter-values">{filters.sports.join(', ')}</span>
            </div>
          )}
          {filters.years?.length > 0 && (
            <div className="filter-tag">
              <span className="filter-label">Years:</span>
              <span className="filter-values">{filters.years[0]} - {filters.years[1]}</span>
            </div>
          )}
          {filters.medals?.length > 0 && (
            <div className="filter-tag">
              <span className="filter-label">Medals:</span>
              <span className="filter-values">{filters.medals.join(', ')}</span>
            </div>
          )}
        </div>
        <p className="filter-result">
          Showing <strong>{dataCount}</strong> filtered results
        </p>
      </div>
    </div>
  )
}

export default FilterSummary
