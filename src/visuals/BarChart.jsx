import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function BarChart({ data, width = 800, height = 400, title, xField = 'country', yField = 'total' }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // Clear previous chart

    const margin = { top: 20, right: 30, bottom: 60, left: 80 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Helper functions to extract values
    const xValue = d => d[xField] || d.country || d.sport || d.name || 'Unknown'
    const yValue = d => {
      const value = d[yField] || d.total || d.medals || d.count || 0
      return isNaN(value) ? 0 : Number(value)
    }

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(xValue))
      .range([0, innerWidth])
      .padding(0.1)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, yValue) || 100])
      .range([innerHeight, 0])

    // Create color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(xValue(d)))
      .attr('y', d => yScale(yValue(d)))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(yValue(d)))
      .attr('fill', (d, i) => colorScale(i))
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1)
        
        // Tooltip
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
          <strong>${xValue(d)}</strong><br/>
          Value: ${yValue(d)}<br/>
          ${d.gold ? `Gold: ${d.gold}<br/>` : ''}
          ${d.silver ? `Silver: ${d.silver}<br/>` : ''}
          ${d.bronze ? `Bronze: ${d.bronze}<br/>` : ''}
          ${d.total ? `Total: ${d.total}` : ''}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.8)
        d3.selectAll('.tooltip').remove()
      })

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale))

    // Add y-axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#64748b')
      .text('Total Medals')

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
        <span style={{ color: '#64748b', fontSize: '1.1rem' }}>No data available for chart</span>
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

export default BarChart
