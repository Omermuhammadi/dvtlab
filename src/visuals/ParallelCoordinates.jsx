import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ParallelCoordinates = ({ data, width = 800, height = 400, margin = { top: 50, right: 50, bottom: 50, left: 100 } }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extract dimensions (numeric attributes)
    const dimensions = ["Age", "Medal_Count", "Country_Rank", "Sport_Popularity", "Performance_Score"];
    
    // Create scales for each dimension
    const scales = {};
    dimensions.forEach(dim => {
      const extent = d3.extent(data, d => {
        if (dim === "Age") return d.age || 25;
        if (dim === "Medal_Count") return d.medalCount || 0;
        if (dim === "Country_Rank") return d.countryRank || 50;
        if (dim === "Sport_Popularity") return d.sportPopularity || 5;
        if (dim === "Performance_Score") return d.performanceScore || 50;
        return 0;
      });
      scales[dim] = d3.scaleLinear()
        .domain(extent)
        .range([innerHeight, 0]);
    });

    // Position scales
    const x = d3.scalePoint()
      .domain(dimensions)
      .range([0, innerWidth]);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Draw the lines
    const line = d3.line()
      .defined(d => d !== null && d !== undefined);

    const paths = g.selectAll(".line")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", d => {
        return line(dimensions.map(dim => {
          let value;
          if (dim === "Age") value = d.age || 25;
          else if (dim === "Medal_Count") value = d.medalCount || 0;
          else if (dim === "Country_Rank") value = d.countryRank || 50;
          else if (dim === "Sport_Popularity") value = d.sportPopularity || 5;
          else if (dim === "Performance_Score") value = d.performanceScore || 50;
          else value = 0;
          
          return [x(dim), scales[dim](value)];
        }));
      })
      .style("fill", "none")
      .style("stroke", (d, i) => color(i % 10))
      .style("stroke-width", 1.5)
      .style("opacity", 0.7);

    // Add axes
    const axes = g.selectAll(".axis")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "axis")
      .attr("transform", d => `translate(${x(d)},0)`);

    axes.append("g")
      .each(function(d) {
        d3.select(this).call(d3.axisLeft(scales[d]));
      });

    // Add axis labels
    axes.append("text")
      .style("text-anchor", "middle")
      .attr("y", -20)
      .text(d => d.replace("_", " "))
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#333");

    // Add interactivity
    paths
      .on("mouseover", function(event, d) {
        d3.select(this)
          .style("stroke-width", 3)
          .style("opacity", 1);
        
        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", 1000);
        
        tooltip.html(`
          <strong>${d.name || d.country || 'Athlete'}</strong><br/>
          Age: ${d.age || 'N/A'}<br/>
          Medals: ${d.medalCount || 0}<br/>
          Country Rank: ${d.countryRank || 'N/A'}<br/>
          Sport Popularity: ${d.sportPopularity || 'N/A'}<br/>
          Performance: ${d.performanceScore || 'N/A'}
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("stroke-width", 1.5)
          .style("opacity", 0.7);
        
        d3.selectAll(".tooltip").remove();
      });

    // Add title
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Multi-Dimensional Performance Analysis");

  }, [data, width, height, margin]);

  return (
    <div className="parallel-coordinates-container">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ overflow: 'visible' }}
      />
    </div>
  );
};

export default ParallelCoordinates;
