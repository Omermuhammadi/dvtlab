import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const MedalHeatmap = ({ data, width = 800, height = 600, title = "Medal Heatmap by Country and Sport" }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 60, right: 80, bottom: 120, left: 120 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Get unique countries and sports
    const countries = [...new Set(data.map(d => d.country))]
    const sports = [...new Set(data.map(d => d.sport))]

    // Create scales
    const xScale = d3.scaleBand()
      .domain(sports)
      .range([0, innerWidth])
      .padding(0.05)

    const yScale = d3.scaleBand()
      .domain(countries)
      .range([0, innerHeight])
      .padding(0.05)

    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateYlOrRd)
      .domain([0, d3.max(data, d => d.total)])

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

    // Add heatmap cells
    g.selectAll('.heatmap-cell')
      .data(data)
      .enter().append('rect')
      .attr('class', 'heatmap-cell')
      .attr('x', d => xScale(d.sport))
      .attr('y', d => yScale(d.country))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.total))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 1).attr('stroke-width', 2)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip.html(`
          <strong>${d.country} - ${d.sport}</strong><br/>
          🥇 Gold: ${d.gold}<br/>
          🥈 Silver: ${d.silver}<br/>
          🥉 Bronze: ${d.bronze}<br/>
          🏆 Total: ${d.total}<br/>
          👥 Athletes: ${d.athletes}<br/>
          📊 Events: ${d.events}
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.8).attr('stroke-width', 1)
        tooltip.transition().duration(500).style('opacity', 0)
      })

    // Add text labels for high values
    g.selectAll('.heatmap-text')
      .data(data.filter(d => d.total > d3.max(data, d => d.total) * 0.3))
      .enter().append('text')
      .attr('class', 'heatmap-text')
      .attr('x', d => xScale(d.sport) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.country) + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#fff')
      .text(d => d.total)

    // Add x axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', '#4a5568')

    // Add y axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#4a5568')

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 20)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#4a5568')
      .text('Countries')

    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 20})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#4a5568')
      .text('Sports')

    // Add color legend
    const legendHeight = 200
    const legendWidth = 20
    const legendScale = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([legendHeight, 0])

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5)
      .tickFormat(d3.format('.0f'))

    const legend = svg.append('g')
      .attr('transform', `translate(${width - 60}, ${margin.top + 20})`)

    // Create gradient for legend
    const defs = svg.append('defs')
    const gradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%')

    gradient.selectAll('stop')
      .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100 * i / n.length}%`, color: colorScale(t) })))
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)')

    legend.append('g')
      .attr('transform', `translate(${legendWidth}, 0)`)
      .call(legendAxis)
      .style('font-size', '12px')

    legend.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', legendWidth + 40)
      .attr('x', -legendHeight / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#4a5568')
      .text('Total Medals')

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

export default MedalHeatmap
