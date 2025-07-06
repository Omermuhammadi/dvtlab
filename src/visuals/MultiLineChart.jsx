import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function MultiLineChart({ data, width = 800, height = 400, title }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 100, bottom: 50, left: 70 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total)])
      .range([innerHeight, 0])

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(['male', 'female', 'total'])
      .range(['#3b82f6', '#ec4899', '#059669'])

    // Create line generators
    const maleLine = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.male))
      .curve(d3.curveMonotoneX)

    const femaleLine = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.female))
      .curve(d3.curveMonotoneX)

    const totalLine = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.total))
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

    // Add the lines
    g.append('path')
      .datum(data)
      .attr('class', 'line male-line')
      .attr('fill', 'none')
      .attr('stroke', colorScale('male'))
      .attr('stroke-width', 3)
      .attr('d', maleLine)

    g.append('path')
      .datum(data)
      .attr('class', 'line female-line')
      .attr('fill', 'none')
      .attr('stroke', colorScale('female'))
      .attr('stroke-width', 3)
      .attr('d', femaleLine)

    g.append('path')
      .datum(data)
      .attr('class', 'line total-line')
      .attr('fill', 'none')
      .attr('stroke', colorScale('total'))
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .attr('d', totalLine)

    // Add dots for male athletes
    g.selectAll('.male-dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'male-dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.male))
      .attr('r', 5)
      .attr('fill', colorScale('male'))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)

    // Add dots for female athletes
    g.selectAll('.female-dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'female-dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.female))
      .attr('r', 5)
      .attr('fill', colorScale('female'))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)

    // Add dots for total
    g.selectAll('.total-dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'total-dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.total))
      .attr('r', 4)
      .attr('fill', colorScale('total'))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)

    // Add interactivity to all dots
    g.selectAll('circle')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 8)
        
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
        
        const femalePercentage = ((d.female / d.total) * 100).toFixed(1)
        const malePercentage = ((d.male / d.total) * 100).toFixed(1)
        
        tooltip.html(`
          <strong>Year: ${d.year}</strong><br/>
          Male: ${d.male.toLocaleString()} (${malePercentage}%)<br/>
          Female: ${d.female.toLocaleString()} (${femalePercentage}%)<br/>
          Total: ${d.total.toLocaleString()}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', d => d3.select(this).classed('total-dot') ? 4 : 5)
        d3.selectAll('.tooltip').remove()
      })

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))

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
      .text('Number of Athletes')

    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#64748b')
      .text('Year')

    // Add legend
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${innerWidth - 90}, 20)`)

    const legendData = [
      { label: 'Male', color: colorScale('male'), dasharray: 'none' },
      { label: 'Female', color: colorScale('female'), dasharray: 'none' },
      { label: 'Total', color: colorScale('total'), dasharray: '5,5' }
    ]

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)

    legendItems.append('line')
      .attr('x1', 0)
      .attr('x2', 15)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', d => d.dasharray)

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
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

export default MultiLineChart
