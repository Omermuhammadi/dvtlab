import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function ViolinPlot({ data, width = 800, height = 500, title = "Age Distribution by Sport" }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 60, right: 50, bottom: 80, left: 80 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Set up SVG
    svg.attr('width', width).attr('height', height)

    // Group data by sport
    const sportGroups = d3.group(data, d => d.sport)
    const sports = Array.from(sportGroups.keys())

    // Create scales
    const xScale = d3.scaleBand()
      .domain(sports)
      .range([0, innerWidth])
      .padding(0.1)

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.age))
      .range([innerHeight, 0])

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

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
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')
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
      .text('Age')

    // Create violin shapes for each sport
    sports.forEach((sport, i) => {
      const sportData = sportGroups.get(sport)
      const ages = sportData.map(d => d.age)
      
      // Create histogram bins
      const bins = d3.histogram()
        .domain(yScale.domain())
        .thresholds(15)(ages)

      // Create density estimation
      const maxBinLength = d3.max(bins, d => d.length)
      const xBandWidth = xScale.bandwidth()

      // Create violin path
      const violinGroup = g.append('g')
        .attr('transform', `translate(${xScale(sport)}, 0)`)

      // Create left and right side of violin
      const leftLine = d3.line()
        .x(d => -((d.length / maxBinLength) * (xBandWidth / 2)))
        .y(d => yScale((d.x0 + d.x1) / 2))
        .curve(d3.curveBasis)

      const rightLine = d3.line()
        .x(d => (d.length / maxBinLength) * (xBandWidth / 2))
        .y(d => yScale((d.x0 + d.x1) / 2))
        .curve(d3.curveBasis)

      // Draw violin shape
      const violinPath = violinGroup.append('path')
        .datum(bins)
        .attr('d', d => {
          const leftPath = leftLine(d)
          const rightPath = rightLine(d)
          return leftPath + 'L' + rightLine(d.slice().reverse()).slice(1) + 'Z'
        })
        .attr('fill', colorScale(i))
        .attr('opacity', 0.7)
        .attr('stroke', '#333')
        .attr('stroke-width', 1)

      // Add median line
      const median = d3.median(ages)
      violinGroup.append('line')
        .attr('x1', -xBandWidth / 4)
        .attr('x2', xBandWidth / 4)
        .attr('y1', yScale(median))
        .attr('y2', yScale(median))
        .attr('stroke', '#333')
        .attr('stroke-width', 2)

      // Add quartile box
      const q1 = d3.quantile(ages.sort(d3.ascending), 0.25)
      const q3 = d3.quantile(ages.sort(d3.ascending), 0.75)
      
      violinGroup.append('rect')
        .attr('x', -xBandWidth / 8)
        .attr('y', yScale(q3))
        .attr('width', xBandWidth / 4)
        .attr('height', yScale(q1) - yScale(q3))
        .attr('fill', '#333')
        .attr('opacity', 0.6)

      // Add hover functionality
      violinGroup
        .on('mouseover', function(event) {
          d3.select(this).select('path').attr('opacity', 1)
          
          // Create tooltip
          const tooltip = d3.select('body').selectAll('.violin-tooltip').data([sportData])
          const tooltipEnter = tooltip.enter().append('div')
            .attr('class', 'violin-tooltip')
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
              <div><strong>${sport}</strong></div>
              <div>Athletes: ${sportData.length}</div>
              <div>Avg Age: ${d3.mean(ages).toFixed(1)}</div>
              <div>Median: ${median.toFixed(1)}</div>
              <div>Q1: ${q1.toFixed(1)}, Q3: ${q3.toFixed(1)}</div>
            `)
        })
        .on('mouseout', function() {
          d3.select(this).select('path').attr('opacity', 0.7)
          d3.selectAll('.violin-tooltip').remove()
        })
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
        <span style={{ color: '#64748b', fontSize: '1.1rem' }}>No data available for violin plot</span>
      </div>
    )
  }

  return <svg ref={svgRef}></svg>
}

export default ViolinPlot
