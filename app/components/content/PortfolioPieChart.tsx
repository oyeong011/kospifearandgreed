"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PortfolioPieChart = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = [
    { asset: "채권", value: 30 },
    { asset: "현금", value: 10 },
    { asset: "주식", value: 30 },
    { asset: "코인", value: 20 },
    { asset: "기타", value: 10 },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const radius = Math.min(width, height) / 2;

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.asset))
      .range(d3.schemeCategory10);

    const pie = d3.pie<any>().value((d) => d.value);

    const arc = d3
      .arc<d3.PieArcDatum<any>>()
      .innerRadius(0)
      .outerRadius(radius);

    const pieGroup = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arcs = pieGroup
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.asset))
      .attr("stroke", "#fff")
      .attr("stroke-width", "2px");

    // Add labels
    pieGroup
      .selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text((d) => `${d.data.asset} (${d.data.value}%)`)
      .style("fill", "#000")
      .style("font-size", "12px");
  }, [data]);

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
      <svg ref={svgRef} width="100%" height="400px" />
    </div>
  );
};

export default PortfolioPieChart;
