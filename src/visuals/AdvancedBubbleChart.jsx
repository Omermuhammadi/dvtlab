import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function AdvancedBubbleChart({ data, width = 900, height = 600, title = "Performance vs Population Analysis" }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 60, right: 150, bottom: 80, left: 80 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Set up SVG
    svg.attr('width', width).attr('height', height)

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.population))
      .range([0, innerWidth])
      .nice()

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.medals_per_capita))
      .range([innerHeight, 0])
      .nice()

    const radiusScale = d3.scaleSqrt()
      .domain(d3.extent(data, d => d.total_medals))
      .range([5, 40])

    const colorScale = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.region))])
      .range(d3.schemeSet3)

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .text(title)

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickFormat('')
      )
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.3)

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat('')
      )
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.3)

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `${d / 1000000}M`))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 60)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Population (Millions)')

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Medals per Million People')

    // Add bubbles
    const bubbles = g.selectAll('.bubble')
      .data(data)
      .enter().append('circle')
      .attr('class', 'bubble')
      .attr('cx', d => xScale(d.population))
      .attr('cy', d => yScale(d.medals_per_capita))
      .attr('r', d => radiusScale(d.total_medals))
      .style('fill', d => colorScale(d.region))
      .style('opacity', 0.7)
      .style('stroke', '#333')
      .style('stroke-width', 1)

    // Add country labels for top performers
    const topPerformers = data.filter(d => d.medals_per_capita > d3.quantile(data.map(d => d.medals_per_capita), 0.8))
    
    g.selectAll('.country-label')
      .data(topPerformers)
      .enter().append('text')
      .attr('class', 'country-label')
      .attr('x', d => xScale(d.population))
      .attr('y', d => yScale(d.medals_per_capita) - radiusScale(d.total_medals) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(d => d.country)

    // Add hover interactions
    bubbles
      .on('mouseover', function(event, d) {
        d3.select(this)
          .style('opacity', 1)
          .style('stroke-width', 3)
        
        // Create tooltip
        const tooltip = d3.select('body').selectAll('.bubble-tooltip').data([d])
        const tooltipEnter = tooltip.enter().append('div')
          .attr('class', 'bubble-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.9)')
          .style('color', 'white')
          .style('padding', '12px')
          .style('border-radius', '8px')
          .style('pointer-events', 'none')
          .style('font-size', '12px')
          .style('z-index', '1000')
          .style('max-width', '200px')

        tooltipEnter.merge(tooltip)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html(`
            <div><strong>${d.country}</strong></div>
            <div>Region: ${d.region}</div>
            <div>Population: ${(d.population / 1000000).toFixed(1)}M</div>
            <div>Total Medals: ${d.total_medals.toLocaleString()}</div>
            <div>Medals per Million: ${d.medals_per_capita.toFixed(2)}</div>
            <div>Efficiency Rank: ${d.efficiency_rank || 'N/A'}</div>
          `)
      })
      .on('mouseout', function() {
        d3.select(this)
          .style('opacity', 0.7)
          .style('stroke-width', 1)
        d3.selectAll('.bubble-tooltip').remove()
      })

    // Add legend for regions
    const regions = [...new Set(data.map(d => d.region))]
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 140}, 80)`)

    const legendItems = legend.selectAll('.legend-item')
      .data(regions)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`)

    legendItems.append('circle')
      .attr('r', 8)
      .attr('fill', d => colorScale(d))
      .attr('opacity', 0.7)

    legendItems.append('text')
      .attr('x', 15)
      .attr('y', 5)
      .style('font-size', '12px')
      .text(d => d)

    // Add size legend
    const sizeLegend = svg.append('g')
      .attr('class', 'size-legend')
      .attr('transform', `translate(${width - 140}, ${height - 150})`)

    sizeLegend.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('Total Medals:')

    const sampleSizes = [100, 500, 1000, 2000]
    sampleSizes.forEach((size, i) => {
      const radius = radiusScale(size)
      sizeLegend.append('circle')
        .attr('cx', 20)
        .attr('cy', 20 + i * 25)
        .attr('r', radius)
        .style('fill', 'none')
        .style('stroke', '#333')
        .style('stroke-width', 1)

      sizeLegend.append('text')
        .attr('x', 45)
        .attr('y', 25 + i * 25)
        .style('font-size', '10px')
        .text(size)
    })

  }, [data, width, height, title])

  if (!data || data.length === 0) {
    return (
      <div style={{ 
        width: width, 
        height: height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '2px dashed #e2e8f0',
        borderRadius: '8px',
        background: '#f8fafc'
      }}>
        <span style={{ color: '#64748b', fontSize: '1.1rem' }}>No data available for advanced bubble chart</span>
      </div>
    )
  }

  return <svg ref={svgRef}></svg>
}

export default AdvancedBubbleChart
