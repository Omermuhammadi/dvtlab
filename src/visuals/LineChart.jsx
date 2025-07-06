import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function LineChart({ data, width = 800, height = 400, title, xField = 'year', yField = 'total' }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 50, left: 70 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Helper functions to extract values
    const xValue = d => {
      const value = d[xField] || d.year || d.age || 0
      return isNaN(value) ? 0 : Number(value)
    }
    const yValue = d => {
      const value = d[yField] || d.total || d.count || d.medals || 0
      return isNaN(value) ? 0 : Number(value)
    }

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue) || [0, 100])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, yValue) || 100])
      .range([innerHeight, 0])

    // Create line generator
    const line = d3.line()
      .x(d => xScale(xValue(d)))
      .y(d => yScale(yValue(d)))
      .curve(d3.curveMonotoneX)

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

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

    // Add the line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 3)
      .attr('d', line)

    // Add dots
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d)))
      .attr('r', 4)
      .attr('fill', '#2563eb')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 6)
        
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0)
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '10px')
          .style('border-radius', '5px')
          .style('font-size', '12px')

        tooltip.transition()
          .duration(200)
          .style('opacity', .9)
        
        tooltip.html(`
          <strong>${xField}: ${xValue(d)}</strong><br/>
          ${yField}: ${yValue(d)}<br/>
          ${d.summer ? `Summer: ${d.summer}<br/>` : ''}
          ${d.winter ? `Winter: ${d.winter}<br/>` : ''}
          ${d.total ? `Total: ${d.total}` : ''}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4)
        d3.selectAll('.tooltip').remove()
      })

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale))

    // Add labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#64748b')
      .text(yField.charAt(0).toUpperCase() + yField.slice(1))

    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#64748b')
      .text(xField.charAt(0).toUpperCase() + xField.slice(1))

  }, [data, width, height])

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
        <span style={{ color: '#64748b', fontSize: '1.1rem' }}>No data available for line chart</span>
      </div>
    )
  }

  return (
    <div className="chart-wrapper">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  )
}

export default LineChart
