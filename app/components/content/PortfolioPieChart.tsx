"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataItem {
  asset: string;
  value: number;
}

const PortfolioPieChart = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const data: DataItem[] = [
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
    const radius = (Math.min(width, height) / 2) * 0.8;

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.asset))
      .range(d3.schemeCategory10);

    const pie = d3.pie<DataItem>().value((d) => d.value);

    const arc = d3
      .arc<d3.PieArcDatum<DataItem>>()
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

    // Add labels inside the pie chart
    pieGroup
      .selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text((d) => {
        const percent = Math.round(
          (d.value / d3.sum(data, (d) => d.value)) * 100
        );
        return percent > 5 ? `${d.data.asset}\n${percent}%` : "";
      })
      .call(wrapText, 40);

    // Function to wrap text
    function wrapText(
      selections: d3.Selection<
        SVGTextElement,
        d3.PieArcDatum<DataItem>,
        SVGGElement,
        unknown
      >,
      width: number
    ) {
      selections.each(function () {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line: string[] = [];
        let lineNumber = 0;
        const lineHeight = 1.1; // ems
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy") || "0");
        let tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em");

        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if ((tspan.node()?.getComputedTextLength() || 0) > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", 0)
              .attr("y", y)
              .attr("dy", `${++lineNumber * lineHeight + dy}em`)
              .text(word);
          }
        }
      });
    }
  }, [data]);

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
      <svg ref={svgRef} width="100%" height="400px" />
    </div>
  );
};

export default PortfolioPieChart;
