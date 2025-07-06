import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function StackedBarChart({ data, width = 800, height = 500, title }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 100, bottom: 80, left: 100 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Stack the data
    const stack = d3.stack().keys(['gold', 'silver', 'bronze'])
    const stackedData = stack(data)

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.country))
      .range([0, innerWidth])
      .padding(0.1)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total)])
      .range([innerHeight, 0])

    // Color scale for medals
    const colorScale = d3.scaleOrdinal()
      .domain(['gold', 'silver', 'bronze'])
      .range(['#FFD700', '#C0C0C0', '#CD7F32'])

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create bars
    const series = g.selectAll('.series')
      .data(stackedData)
      .enter().append('g')
      .attr('class', 'series')
      .attr('fill', d => colorScale(d.key))

    series.selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => xScale(d.data.country))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1)
        
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
          <strong>${d.data.country}</strong><br/>
          Gold: ${d.data.gold}<br/>
          Silver: ${d.data.silver}<br/>
          Bronze: ${d.data.bronze}<br/>
          Total: ${d.data.total}
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
      .style('font-size', '12px')

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
      .text('Number of Medals')

    // Add legend
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${innerWidth + 20}, 20)`)

    const legendItems = legend.selectAll('.legend-item')
      .data(['Gold', 'Silver', 'Bronze'])
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`)

    legendItems.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', d => colorScale(d.toLowerCase()))

    legendItems.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .style('font-size', '14px')
      .style('fill', '#374151')
      .text(d => d)

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

export default StackedBarChart
