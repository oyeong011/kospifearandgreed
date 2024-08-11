"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";

interface DataPoint {
  date: Date;
  value: number;
  z_score_grade: number;
}

interface DataFormat {
  date: string;
  value: number;
  z_score_grade: number;
}

interface LineChartProps {
  data: DataPoint[];
  showMovingAverage?: boolean;
  title: string;
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
    result.push({ date: data[i].date, value: average, z_score_grade: 0 });
  }
  return result;
};

//각 지표에서 z_score_grade를 받아와서 공포 탐욕 정도를 계산 12.5이 최대이고 0이 최소 5 대 4 대 2 대 4 대 5 등분으로 극도의 공포 공포 중립 탐욕 극도의 탐욕으로 나누어짐

const fearOrGreed = (z_score_grade: number) => {
  let result = "";
  if (z_score_grade >= 10) {
    result = "Extreme Greed";
  } else if (z_score_grade >= 8) {
    result = "Greed";
  } else if (z_score_grade >= 6) {
    result = "Neutral";
  } else if (z_score_grade >= 4) {
    result = "Fear";
  } else {
    result = "Extreme Fear";
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

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    if (!data || data.length === 0) {
      console.error("Data is empty or invalid", data);
      return;
    }

    const drawChart = () => {
      const container = containerRef.current!;
      const svg = d3.select(svgRef.current);

      // Clear previous content
      svg.selectAll("*").remove();

      const width = container.clientWidth;
      const height = container.clientHeight;
      const margin = { top: 40, right: 30, bottom: 30, left: 60 };

      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date) as [Date, Date])
        .range([margin.left, width - margin.right]);

      const minValue = d3.min(data, (d) => d.value) as number;
      const maxValue = d3.max(data, (d) => d.value) as number;

      const includeZero = minValue > 0 && maxValue > 0;
      const includeNegative = minValue < 0;

      let yDomain: [number, number];
      if (includeNegative) {
        yDomain = [minValue, Math.max(0, maxValue)];
      } else {
        yDomain = [minValue, maxValue];
      }

      const y = d3
        .scaleLinear()
        .domain(yDomain)
        .nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line<DataPoint>()
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      // Determine the position of x-axis
      const xAxisPosition = y(Math.max(yDomain[0], 0));

      // Add x-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${xAxisPosition})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        );

      // Format y-axis ticks based on the data range
      const yRange = Math.abs(yDomain[1] - yDomain[0]);
      let yAxisTickFormat: (n: d3.NumberValue) => string;

      if (yRange >= 1000000) {
        yAxisTickFormat = d3.format(".3s"); // Use SI-prefix for large numbers
      } else if (yRange < 1) {
        yAxisTickFormat = d3.format(".2f"); // Use 2 decimal places for small numbers
      } else {
        yAxisTickFormat = d3.format(","); // Use comma as thousands separator
      }

      // Add y-axis
      const yAxis = svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(yAxisTickFormat));

      // Remove y-axis domain line
      yAxis.select(".domain").remove();

      // Add horizontal grid lines
      yAxis
        .selectAll(".tick line")
        .clone()
        .attr("x2", width - margin.left - margin.right)
        .attr("stroke-opacity", 0.1);

      // Add y-axis label
      yAxis
        .append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Value");

      // Add a horizontal line at y=0 if the domain includes negative values
      if (includeNegative) {
        svg
          .append("line")
          .attr("x1", margin.left)
          .attr("x2", width - margin.right)
          .attr("y1", y(0))
          .attr("y2", y(0))
          .attr("stroke", "black")
          .attr("stroke-opacity", 0.5)
          .attr("stroke-dasharray", "4");
      }

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

    // d3.extent에 대한 안전 처리 추가
    const dateExtent = d3.extent(data, (d) => d.date);
    if (!dateExtent[0] || !dateExtent[1]) {
      console.error("Invalid date extent", dateExtent);
      return;
    }

    drawChart();

    const resizeObserver = new ResizeObserver(drawChart);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [data, showMovingAverage, title]);

  // 데이터가 없을 경우 메시지 표시
  if (!data || data.length === 0) {
    return (
      // 스켈레톤 UI를 위해 motion.div 사용
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center w-full h-96 bg-gray-100 rounded-lg"
      ></motion.div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: "100%", height: "400px" }}>
      {/* 구한 데이터중 가장 마지막 데이터를 가져와서 공포 탐욕 정도를 계산 */}
      <h2 className="text-xl font-semibold mb-4 border-solid border-r-2">
        {fearOrGreed(data[data.length - 1].z_score_grade)}
      </h2>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default LineChart;
