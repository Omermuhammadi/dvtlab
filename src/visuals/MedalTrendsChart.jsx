import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const MedalTrendsChart = ({ data, width = 800, height = 500, title = "Medal Trends Over Time" }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 40, right: 120, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Group data by country and sport
    const nestedData = d3.group(data, d => `${d.country}-${d.sport}`)

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total)])
      .range([innerHeight, 0])

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => `${d.country}-${d.sport}`))])
      .range(d3.schemeCategory10)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#2d3748')
      .text(title)

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '10px')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('font-size', '12px')

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.total))
      .curve(d3.curveMonotoneX)

    // Add lines for each country-sport combination
    nestedData.forEach((values, key) => {
      const [country, sport] = key.split('-')
      const sortedValues = values.sort((a, b) => a.year - b.year)
      
      g.append('path')
        .datum(sortedValues)
        .attr('fill', 'none')
        .attr('stroke', colorScale(key))
        .attr('stroke-width', 2)
        .attr('d', line)
        .style('opacity', 0.7)

      // Add circles for data points
      g.selectAll(`.circle-${key.replace(/[^a-zA-Z0-9]/g, '')}`)
        .data(sortedValues)
        .enter().append('circle')
        .attr('class', `circle-${key.replace(/[^a-zA-Z0-9]/g, '')}`)
        .attr('cx', d => xScale(d.year))
        .attr('cy', d => yScale(d.total))
        .attr('r', 4)
        .attr('fill', colorScale(key))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .style('opacity', 0.8)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('r', 6).style('opacity', 1)
          tooltip.transition().duration(200).style('opacity', 1)
          tooltip.html(`
            <strong>${d.country} - ${d.sport}</strong><br/>
            📅 Year: ${d.year}<br/>
            🥇 Gold: ${d.gold}<br/>
            🥈 Silver: ${d.silver}<br/>
            🥉 Bronze: ${d.bronze}<br/>
            🏆 Total: ${d.total}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 4).style('opacity', 0.8)
          tooltip.transition().duration(500).style('opacity', 0)
        })
    })

    // Add x axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
      .style('font-size', '12px')

    // Add y axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .style('font-size', '12px')

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#4a5568')
      .text('Total Medals')

    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#4a5568')
      .text('Year')

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 110}, 60)`)

    const legendItems = legend.selectAll('.legend-item')
      .data([...nestedData.keys()].slice(0, 6)) // Show first 6 items
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)

    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => colorScale(d))
      .attr('stroke', '#fff')

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '10px')
      .style('fill', '#4a5568')
      .text(d => d.replace('-', ' - '))

    // Cleanup tooltip on component unmount
    return () => {
      d3.select('body').selectAll('.tooltip').remove()
    }
  }, [data, width, height, title])

  if (!data || data.length === 0) {
    return (
      <div style={{ 
        width, 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f7fafc',
        border: '2px dashed #e2e8f0',
        borderRadius: '8px'
      }}>
        <span style={{ color: '#718096', fontSize: '14px' }}>
          No data available for selected filters
        </span>
      </div>
    )
  }

  return <svg ref={svgRef} width={width} height={height}></svg>
}

export default MedalTrendsChart
