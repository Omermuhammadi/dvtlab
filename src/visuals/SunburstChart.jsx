import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function SunburstChart({ data, width = 600, height = 600, title }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const radius = Math.min(width, height) / 2 - 40

    // Create hierarchical data structure
    const root = {
      name: "Olympics",
      children: data.map(sport => ({
        name: sport.sport,
        value: sport.medals,
        goldMedals: sport.goldMedals,
        avgAge: sport.avgAge,
        athletes: sport.athletes,
        events: sport.events
      }))
    }

    // Create hierarchy
    const hierarchy = d3.hierarchy(root)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)

    // Create partition layout
    const partition = d3.partition()
      .size([2 * Math.PI, radius])

    // Apply partition to hierarchy
    const partitionData = partition(hierarchy)

    // Create arc generator
    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1)

    // Color scale
    const colorScale = d3.scaleOrdinal(d3.schemeSet3)

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    // Create arcs
    const paths = g.selectAll('path')
      .data(partitionData.descendants().filter(d => d.depth > 0))
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colorScale(i))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')

    // Add interactivity
    paths
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('stroke-width', 4)

        // Create tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0)
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '12px')
          .style('border-radius', '8px')
          .style('font-size', '12px')
          .style('max-width', '200px')

        tooltip.transition()
          .duration(200)
          .style('opacity', .9)

        if (d.data.sport) {
          tooltip.html(`
            <strong>${d.data.name}</strong><br/>
            Total Medals: ${d.data.value}<br/>
            Gold Medals: ${d.data.goldMedals}<br/>
            Average Age: ${d.data.avgAge} years<br/>
            Athletes: ${d.data.athletes}<br/>
            Events: ${d.data.events}
          `)
        } else {
          tooltip.html(`<strong>${d.data.name}</strong><br/>Total: ${d.value}`)
        }

        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 2)

        d3.selectAll('.tooltip').remove()
      })

    // Add labels for larger segments
    const labels = g.selectAll('text')
      .data(partitionData.descendants().filter(d => d.depth === 1 && d.value > 200))
      .enter().append('text')
      .attr('transform', d => {
        const angle = (d.x0 + d.x1) / 2
        const radius = (d.y0 + d.y1) / 2
        return `rotate(${(angle * 180 / Math.PI - 90)}) translate(${radius},0) rotate(${angle > Math.PI ? 180 : 0})`
      })
      .attr('dy', '0.35em')
      .style('text-anchor', d => (d.x0 + d.x1) / 2 > Math.PI ? 'end' : 'start')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('pointer-events', 'none')
      .text(d => d.data.name)

    // Add center label
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text('Olympic Sports')

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '12px')
      .style('fill', '#666')
      .text(`${data.length} Sports`)

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

export default SunburstChart
