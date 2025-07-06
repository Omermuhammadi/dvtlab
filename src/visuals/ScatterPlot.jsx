import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function ScatterPlot({ data, width = 800, height = 500, title = "Scatter Plot" }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 40, right: 100, bottom: 60, left: 80 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Set up SVG
    svg.attr('width', width).attr('height', height)

    // Create scales - handle different data structures with better validation
    const xValue = d => {
      const value = d.x || d.avgAge || d.age || d.year || 0
      return isNaN(value) ? 0 : Number(value)
    }
    const yValue = d => {
      const value = d.y || d.medals || d.total || d.count || 0
      return isNaN(value) ? 0 : Number(value)
    }
    const rValue = d => {
      const value = d.size || d.athletes || d.total || 10
      return isNaN(value) ? 10 : Number(value)
    }

    // Get valid domains with fallbacks
    const xExtent = d3.extent(data, xValue)
    const xDomain = xExtent[0] !== undefined && xExtent[1] !== undefined && !isNaN(xExtent[0]) && !isNaN(xExtent[1]) ? xExtent : [0, 100]
    
    const yMax = d3.max(data, yValue)
    const yDomain = [0, yMax !== undefined && !isNaN(yMax) ? yMax : 100]
    
    const rMax = d3.max(data, rValue)
    const rDomain = [0, rMax !== undefined && !isNaN(rMax) ? rMax : 100]

    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, innerWidth])
      .nice()

    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([innerHeight, 0])
      .nice()

    const radiusScale = d3.scaleSqrt()
      .domain(rDomain)
      .range([4, 20])

    const colorScale = d3.scaleOrdinal(d3.schemeSet2)

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(title)

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 50)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Age / Year')

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Medals / Count')

    // Add circles with validation
    const validData = data.filter(d => {
      const x = xValue(d)
      const y = yValue(d)
      const r = rValue(d)
      return !isNaN(x) && !isNaN(y) && !isNaN(r)
    })

    g.selectAll('.dot')
      .data(validData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d)))
      .attr('r', d => radiusScale(rValue(d)))
      .style('fill', (d, i) => colorScale(i % 8))
      .style('opacity', 0.7)
      .style('stroke', '#333')
      .style('stroke-width', 1)
      .on('mouseover', function(event, d) {
        // Simple tooltip
        d3.select(this).style('opacity', 1)
        
        // Create tooltip
        const tooltip = d3.select('body').selectAll('.scatter-tooltip').data([d])
        const tooltipEnter = tooltip.enter().append('div')
          .attr('class', 'scatter-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('pointer-events', 'none')
          .style('font-size', '12px')
          .style('z-index', '1000')

        tooltipEnter.merge(tooltip)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html(`
            <div>X: ${xValue(d).toFixed(1)}</div>
            <div>Y: ${yValue(d).toFixed(0)}</div>
            ${d.sport || d.name ? `<div>Sport: ${d.sport || d.name}</div>` : ''}
            ${d.size || d.athletes ? `<div>Athletes: ${(d.size || d.athletes)?.toLocaleString()}</div>` : ''}
          `)
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.7)
        d3.selectAll('.scatter-tooltip').remove()
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
        <span style={{ color: '#64748b', fontSize: '1.1rem' }}>No data available for scatter plot</span>
      </div>
    )
  }

  return <svg ref={svgRef}></svg>
}

export default ScatterPlot
