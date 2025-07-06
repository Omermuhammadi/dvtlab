import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PerformanceMatrix = ({ data, width = 600, height = 500, margin = { top: 80, right: 100, bottom: 80, left: 100 } }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Process data to create matrix
    const ageGroups = ["18-25", "26-30", "31-35", "36+"];
    const sports = [...new Set(data.map(d => d.sport))].slice(0, 8); // Top 8 sports

    // Create matrix data
    const matrixData = [];
    ageGroups.forEach(ageGroup => {
      sports.forEach(sport => {
        const athletes = data.filter(d => {
          const age = d.age || 25;
          let inAgeGroup = false;
          if (ageGroup === "18-25") inAgeGroup = age >= 18 && age <= 25;
          else if (ageGroup === "26-30") inAgeGroup = age >= 26 && age <= 30;
          else if (ageGroup === "31-35") inAgeGroup = age >= 31 && age <= 35;
          else if (ageGroup === "36+") inAgeGroup = age >= 36;
          
          return inAgeGroup && d.sport === sport;
        });
        
        const medalCount = athletes.reduce((sum, athlete) => sum + (athlete.medalCount || 0), 0);
        const successRate = athletes.length > 0 ? (medalCount / athletes.length) * 100 : 0;
        
        matrixData.push({
          ageGroup,
          sport,
          medalCount,
          athleteCount: athletes.length,
          successRate: successRate,
          value: successRate // Use success rate as the main metric
        });
      });
    });

    // Create scales
    const xScale = d3.scaleBand()
      .domain(sports)
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(ageGroups)
      .range([0, innerHeight])
      .padding(0.1);

    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
      .domain(d3.extent(matrixData, d => d.value));

    // Draw rectangles
    const cells = g.selectAll(".cell")
      .data(matrixData)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", d => xScale(d.sport))
      .attr("y", d => yScale(d.ageGroup))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", d => d.value > 0 ? colorScale(d.value) : "#f0f0f0")
      .style("stroke", "#white")
      .style("stroke-width", 2);

    // Add text labels in cells
    g.selectAll(".cell-label")
      .data(matrixData)
      .enter()
      .append("text")
      .attr("class", "cell-label")
      .attr("x", d => xScale(d.sport) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.ageGroup) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("fill", d => d.value > 50 ? "white" : "#333")
      .text(d => d.value > 0 ? d.value.toFixed(1) + "%" : "0%");

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("font-size", "12px");

    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px");

    // Add axis labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -innerHeight / 2)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Age Groups");

    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 10)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Sports");

    // Add title
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", -margin.top + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Success Rate Matrix: Age Groups vs Sports");

    // Add legend
    const legendWidth = 200;
    const legendHeight = 20;
    const legend = g.append("g")
      .attr("transform", `translate(${innerWidth - legendWidth}, -60)`);

    const legendScale = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d => d.toFixed(1) + "%");

    const legendGradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    legendGradient.selectAll("stop")
      .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");

    legend.append("g")
      .attr("transform", `translate(0,${legendHeight})`)
      .call(legendAxis)
      .selectAll("text")
      .style("font-size", "10px");

    legend.append("text")
      .attr("x", legendWidth / 2)
      .attr("y", -5)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Success Rate (%)");

    // Add interactivity
    cells
      .on("mouseover", function(event, d) {
        d3.select(this)
          .style("stroke", "#333")
          .style("stroke-width", 3);
        
        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "10px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", 1000);
        
        tooltip.html(`
          <strong>${d.sport} - ${d.ageGroup}</strong><br/>
          Athletes: ${d.athleteCount}<br/>
          Total Medals: ${d.medalCount}<br/>
          Success Rate: ${d.value.toFixed(2)}%
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("stroke", "white")
          .style("stroke-width", 2);
        
        d3.selectAll(".tooltip").remove();
      });

  }, [data, width, height, margin]);

  return (
    <div className="performance-matrix-container">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ overflow: 'visible' }}
      />
    </div>
  );
};

export default PerformanceMatrix;
