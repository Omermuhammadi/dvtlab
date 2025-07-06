import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function HeatmapChart({ data, width = 800, height = 400, title }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 50, right: 100, bottom: 100, left: 100 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create heatmap data - countries vs medal types
    const heatmapData = []
    const medalTypes = ['gold', 'silver', 'bronze']
    
    data.slice(0, 12).forEach(country => { // Top 12 countries
      medalTypes.forEach(medalType => {
        heatmapData.push({
          country: country.country,
          medalType: medalType,
          value: country[medalType],
          code: country.code
        })
      })
    })

    const countries = [...new Set(heatmapData.map(d => d.country))]

    // Create scales
    const xScale = d3.scaleBand()
      .domain(medalTypes)
      .range([0, innerWidth])
      .padding(0.1)

    const yScale = d3.scaleBand()
      .domain(countries)
      .range([0, innerHeight])
      .padding(0.1)

    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
      .domain([0, d3.max(heatmapData, d => d.value)])

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create heatmap cells
    const cells = g.selectAll('.cell')
      .data(heatmapData)
      .enter().append('rect')
      .attr('class', 'cell')
      .attr('x', d => xScale(d.medalType))
      .attr('y', d => yScale(d.country))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('rx', 4)

    // Add cell labels
    g.selectAll('.cell-label')
      .data(heatmapData)
      .enter().append('text')
      .attr('class', 'cell-label')
      .attr('x', d => xScale(d.medalType) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.country) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', d => d.value > 200 ? 'white' : 'black')
      .text(d => d.value)

    // Add interactivity
    cells
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 4)
          .attr('stroke', '#333')
        
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
          ${d.medalType.charAt(0).toUpperCase() + d.medalType.slice(1)}: ${d.value}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 2)
          .attr('stroke', '#fff')
        
        d3.selectAll('.tooltip').remove()
      })

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('text-transform', 'capitalize')

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')

    // Add axis labels
    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + 50})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .text('Medal Types')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .text('Countries')

    // Add color legend
    const legendWidth = 200
    const legendHeight = 20
    const legendScale = d3.scaleLinear()
      .domain([0, d3.max(heatmapData, d => d.value)])
      .range([0, legendWidth])

    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${innerWidth - legendWidth}, ${innerHeight + 70})`)

    // Create gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%')

    gradient.selectAll('stop')
      .data(d3.range(0, 1.1, 0.1))
      .enter().append('stop')
      .attr('offset', d => d * 100 + '%')
      .attr('stop-color', d => colorScale(d * d3.max(heatmapData, d => d.value)))

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)')

    legend.append('text')
      .attr('x', 0)
      .attr('y', -5)
      .style('font-size', '12px')
      .style('fill', '#374151')
      .text('0')

    legend.append('text')
      .attr('x', legendWidth)
      .attr('y', -5)
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', '#374151')
      .text(d3.max(heatmapData, d => d.value))

    legend.append('text')
      .attr('x', legendWidth / 2)
      .attr('y', 35)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .text('Number of Medals')

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

export default HeatmapChart
