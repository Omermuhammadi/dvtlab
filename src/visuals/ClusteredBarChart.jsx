import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function ClusteredBarChart({ data, width = 800, height = 500, title = "Clustered Bar Chart" }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 60, right: 120, bottom: 80, left: 80 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Set up SVG
    svg.attr('width', width).attr('height', height)

    // Data processing - group by category and subcategory
    const categories = Array.from(new Set(data.map(d => d.category)))
    const subcategories = Array.from(new Set(data.map(d => d.subcategory)))
    
    // Create scales
    const xScale = d3.scaleBand()
      .domain(categories)
      .range([0, innerWidth])
      .padding(0.1)

    const xSubScale = d3.scaleBand()
      .domain(subcategories)
      .range([0, xScale.bandwidth()])
      .padding(0.05)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.1])
      .range([innerHeight, 0])

    const colorScale = d3.scaleOrdinal()
      .domain(subcategories)
      .range(d3.schemeCategory10)

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

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Values')

    // Group data by category
    const groupedData = d3.group(data, d => d.category)

    // Create bars
    const categoryGroups = g.selectAll('.category-group')
      .data(groupedData)
      .enter().append('g')
      .attr('class', 'category-group')
      .attr('transform', d => `translate(${xScale(d[0])},0)`)

    categoryGroups.selectAll('.bar')
      .data(d => d[1])
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xSubScale(d.subcategory))
      .attr('y', d => yScale(d.value))
      .attr('width', xSubScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.value))
      .attr('fill', d => colorScale(d.subcategory))
      .style('opacity', 0.8)
      .style('stroke', '#fff')
      .style('stroke-width', 1)
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 1)
        
        // Create tooltip
        const tooltip = d3.select('body').selectAll('.clustered-tooltip').data([d])
        const tooltipEnter = tooltip.enter().append('div')
          .attr('class', 'clustered-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '10px')
          .style('border-radius', '5px')
          .style('pointer-events', 'none')
          .style('font-size', '12px')
          .style('z-index', '1000')

        tooltipEnter.merge(tooltip)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html(`
            <div><strong>${d.category}</strong></div>
            <div>${d.subcategory}: ${d.value.toLocaleString()}</div>
            ${d.description ? `<div>${d.description}</div>` : ''}
          `)
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.8)
        d3.selectAll('.clustered-tooltip').remove()
      })

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 100}, 60)`)

    const legendItems = legend.selectAll('.legend-item')
      .data(subcategories)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)

    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => colorScale(d))

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .text(d => d)

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
        <span style={{ color: '#64748b', fontSize: '1.1rem' }}>No data available for clustered bar chart</span>
      </div>
    )
  }

  return <svg ref={svgRef}></svg>
}

export default ClusteredBarChart
