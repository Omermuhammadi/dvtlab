import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function BubbleChart({ data, width = 800, height = 500, title }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 20, bottom: 50, left: 80 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.gold)])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.silver)])
      .range([innerHeight, 0])

    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.total)])
      .range([5, 40])

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, d3.max(data, d => d.total)])

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

    // Create bubbles
    const bubbles = g.selectAll('.bubble')
      .data(data)
      .enter().append('circle')
      .attr('class', 'bubble')
      .attr('cx', d => xScale(d.gold))
      .attr('cy', d => yScale(d.silver))
      .attr('r', d => radiusScale(d.total))
      .attr('fill', d => colorScale(d.total))
      .attr('opacity', 0.7)
      .attr('stroke', '#333')
      .attr('stroke-width', 1)

    // Add country labels for top countries
    g.selectAll('.bubble-label')
      .data(data.filter((d, i) => i < 10)) // Top 10 countries
      .enter().append('text')
      .attr('class', 'bubble-label')
      .attr('x', d => xScale(d.gold))
      .attr('y', d => yScale(d.silver))
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('pointer-events', 'none')
      .text(d => d.code)

    // Add interactivity
    bubbles
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3)
        
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
          <strong>${d.country}</strong><br/>
          Gold: ${d.gold}<br/>
          Silver: ${d.silver}<br/>
          Bronze: ${d.bronze}<br/>
          Total: ${d.total}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.7)
          .attr('stroke-width', 1)
        
        d3.selectAll('.tooltip').remove()
      })

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))

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
      .text('Silver Medals')

    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#64748b')
      .text('Gold Medals')

    // Add bubble size legend
    const legendData = [
      { size: 100, label: '100' },
      { size: 500, label: '500' },
      { size: 1000, label: '1000+' }
    ]

    const sizeLegend = g.append('g')
      .attr('class', 'size-legend')
      .attr('transform', `translate(${innerWidth - 120}, 20)`)

    sizeLegend.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .text('Total Medals')

    sizeLegend.selectAll('.legend-bubble')
      .data(legendData)
      .enter().append('circle')
      .attr('class', 'legend-bubble')
      .attr('cx', 30)
      .attr('cy', (d, i) => i * 30 + 20)
      .attr('r', d => radiusScale(d.size))
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', 1)

    sizeLegend.selectAll('.legend-text')
      .data(legendData)
      .enter().append('text')
      .attr('class', 'legend-text')
      .attr('x', 70)
      .attr('y', (d, i) => i * 30 + 25)
      .style('font-size', '11px')
      .style('fill', '#374151')
      .text(d => d.label)

  }, [data, width, height])

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

export default BubbleChart
