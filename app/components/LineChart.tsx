"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  date: Date;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  showMovingAverage?: boolean;
  title: string; // 새로운 prop: 차트 제목
}

const calculateMovingAverage = (
  data: DataPoint[],
  windowSize: number
): DataPoint[] => {
  let result = [];
  for (let i = windowSize - 1; i < data.length; i++) {
    const windowData = data.slice(i - windowSize + 1, i + 1);
    const average =
      windowData.reduce((acc, curr) => acc + curr.value, 0) / windowData.length;
    result.push({ date: data[i].date, value: average });
  }
  return result;
};

const LineChart: React.FC<LineChartProps> = ({
  data,
  showMovingAverage,
  title,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  console.log(title);
  console.log(data);
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const drawChart = () => {
      const container = containerRef.current!;
      const svg = d3.select(svgRef.current);

      // Clear previous content
      svg.selectAll("*").remove();

      const width = container.clientWidth;
      const height = container.clientHeight;
      const margin = { top: 40, right: 30, bottom: 30, left: 40 };

      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date) as [Date, Date])
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value) as number])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line<DataPoint>()
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        );

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(height / 40))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("x2", width - margin.left - margin.right)
            .attr("stroke-opacity", 0.1)
        )
        .call((g) =>
          g
            .append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Value")
        );

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(title);

      if (showMovingAverage) {
        const movingAverageData = calculateMovingAverage(data, 7); // 7-day moving average
        const movingAverageLine = d3
          .line<DataPoint>()
          .x((d) => x(d.date))
          .y((d) => y(d.value));

        svg
          .append("path")
          .datum(movingAverageData)
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 1.5)
          .attr("d", movingAverageLine);
      }
    };

    drawChart();

    const resizeObserver = new ResizeObserver(drawChart);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [data, showMovingAverage, title]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "400px" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default LineChart;
