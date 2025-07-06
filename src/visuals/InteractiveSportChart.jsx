import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const InteractiveSportChart = ({ data, width = 800, height = 500, title = "Interactive Sport Analysis" }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 40, right: 120, bottom: 80, left: 80 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.country))
      .range([0, innerWidth])
      .padding(0.1)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total)])
      .range([innerHeight, 0])

    // Color scale by sport
    const colorScale = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.sport))])
      .range(d3.schemeSet3)

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

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.country))
      .attr('width', xScale.bandwidth())
      .attr('y', d => yScale(d.total))
      .attr('height', d => innerHeight - yScale(d.total))
      .attr('fill', d => colorScale(d.sport))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 1)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip.html(`
          <strong>${d.country} - ${d.sport}</strong><br/>
          🥇 Gold: ${d.gold}<br/>
          🥈 Silver: ${d.silver}<br/>
          🥉 Bronze: ${d.bronze}<br/>
          🏆 Total: ${d.total}<br/>
          👥 Athletes: ${d.athletes}
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.8)
        tooltip.transition().duration(500).style('opacity', 0)
      })

    // Add x axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
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
      .text('Countries')

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 110}, 60)`)

    const legendItems = legend.selectAll('.legend-item')
      .data(colorScale.domain())
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
      .style('font-size', '12px')
      .style('fill', '#4a5568')
      .text(d => d)

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

export default InteractiveSportChart
