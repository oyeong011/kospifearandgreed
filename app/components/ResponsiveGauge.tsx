import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface ResponsiveGaugeProps {
  value: number;
}

const ResponsiveGauge: React.FC<ResponsiveGaugeProps> = ({ value }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const animationDuration = 1000;
    const animationStart = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - animationStart;
      const progress = Math.min(elapsed / animationDuration, 1);

      setCurrentValue(d3.easeCubicOut(progress) * value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = width / 2;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    const outerRadius = Math.min(width, height * 2) / 2 - margin.top;
    const innerRadius = outerRadius * 0.6;

    const arc = d3
      .arc<d3.DefaultArcObject>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    const scale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([-Math.PI / 2, Math.PI / 2]);

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, 25, 45, 55, 75, 100])
      .range([
        "#0074D9",
        "#2ECC40",
        "#FFDC00",
        "#FFDC00",
        "#FF851B",
        "#FF4136",
      ]);

    const gaugeGroup = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height - margin.bottom})`);

    // Draw background arc (white)
    gaugeGroup
      .append("path")
      .attr(
        "d",
        arc({
          innerRadius,
          outerRadius,
          startAngle: -Math.PI / 2,
          endAngle: Math.PI / 2,
        }) || ""
      )
      .style("fill", "#ffffff");

    // Draw filled arc
    const filledArc = gaugeGroup
      .append("path")
      .attr(
        "d",
        arc({
          innerRadius,
          outerRadius,
          startAngle: -Math.PI / 2,
          endAngle: scale(currentValue),
        }) || ""
      )
      .style("fill", colorScale(currentValue));

    // Define segments
    const segments = [
      { start: 0, end: 25, label: "극도의 공포" },
      { start: 25, end: 45, label: "공포" },
      { start: 45, end: 55, label: "중립" },
      { start: 55, end: 75, label: "탐욕" },
      { start: 75, end: 100, label: "극도의 탐욕" },
    ];

    // Draw segment borders
    segments.forEach((segment) => {
      const segmentArc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(scale(segment.start))
        .endAngle(scale(segment.end));

      gaugeGroup
        .append("path")
        .attr(
          "d",
          segmentArc({
            innerRadius,
            outerRadius,
            startAngle: scale(segment.start),
            endAngle: scale(segment.end),
          }) || null
        )
        .attr("fill", "none")
        .attr(
          "stroke",
          currentValue >= segment.start && currentValue < segment.end
            ? "#000"
            : "#ddd"
        )
        .attr(
          "stroke-width",
          currentValue >= segment.start && currentValue < segment.end ? 3 : 1
        );
    });

    // Add ticks and labels for every 25 units
    const ticks = [0, 25, 45, 55, 75, 100];

    // Add tick lines inside the arc
    gaugeGroup
      .selectAll(".tick-line")
      .data(ticks)
      .enter()
      .append("line")
      .attr("class", "tick-line")
      .attr("x1", (d) => innerRadius * Math.cos(scale(d) - Math.PI / 2))
      .attr("y1", (d) => innerRadius * Math.sin(scale(d) - Math.PI / 2))
      .attr("x2", (d) => outerRadius * Math.cos(scale(d) - Math.PI / 2))
      .attr("y2", (d) => outerRadius * Math.sin(scale(d) - Math.PI / 2))
      .style("stroke", "#000")
      .style("stroke-width", "2px");

    // Add labels
    const labels = ["극도의 공포", "공포", "중립", "탐욕", "극도의 탐욕"];
    const labelPositions = [12.5, 35, 50, 65, 87.5];

    gaugeGroup
      .selectAll(".label")
      .data(labelPositions)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("transform", (d) => {
        const angle = scale(d);
        const labelRadius = (innerRadius + outerRadius) / 2;
        return `translate(${labelRadius * Math.cos(angle - Math.PI / 2)},${
          labelRadius * Math.sin(angle - Math.PI / 2)
        })`;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text((d, i) => labels[i])
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#333");

    // Add numeric labels
    gaugeGroup
      .selectAll(".numeric-label")
      .data(ticks)
      .enter()
      .append("text")
      .attr("class", "numeric-label")
      .attr("transform", (d) => {
        const angle = scale(d);
        const labelRadius = outerRadius + 20;
        return `translate(${labelRadius * Math.cos(angle - Math.PI / 2)},${
          labelRadius * Math.sin(angle - Math.PI / 2)
        })`;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) =>
        scale(d) < -Math.PI / 3
          ? "end"
          : scale(d) > Math.PI / 3
          ? "start"
          : "middle"
      )
      .text((d) => d)
      .style("font-size", "14px")
      .style("font-weight", "bold");

    // Add value text in the center
    const valueText = gaugeGroup
      .append("text")
      .attr("class", "value-text")
      .attr("transform", `translate(0,${innerRadius / 2})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "3em")
      .attr("font-weight", "bold")
      .text(Math.round(currentValue));

    // Add needle
    const needleLength = outerRadius - innerRadius;
    const needleRadius = 5;
    const needle = gaugeGroup.append("g").attr("class", "needle");

    needle
      .append("path")
      .attr(
        "d",
        `M ${-needleRadius} 0 L 0 ${-needleLength} L ${needleRadius} 0 Z`
      )
      .attr("fill", "#444");

    needle.append("circle").attr("r", needleRadius).attr("fill", "#444");

    // 초기 바늘 위치 설정
    updateNeedlePosition(currentValue);

    // 바늘 위치 업데이트 함수
    function updateNeedlePosition(value: number) {
      const angle = scale(value);
      needle.attr("transform", `rotate(${(angle * 180) / Math.PI})`);
    }
    // Update the gauge when currentValue changes
    d3.select(svgRef.current).on("change", () => {
      filledArc
        .transition()
        .duration(50)
        .attrTween("d", function (this: SVGPathElement) {
          return function (t: number) {
            const interpolatedAngle = d3.interpolate(
              scale(0),
              scale(currentValue)
            )(t);
            return (
              arc({
                innerRadius,
                outerRadius,
                startAngle: -Math.PI / 2,
                endAngle: interpolatedAngle,
              }) || ""
            );
          };
        })
        .style("fill", colorScale(currentValue));

      // Update segment borders
      gaugeGroup
        .selectAll("path")
        .attr("stroke", (d, i) =>
          currentValue >= segments[i].start && currentValue < segments[i].end
            ? "#000"
            : "#ddd"
        )
        .attr("stroke-width", (d, i) =>
          currentValue >= segments[i].start && currentValue < segments[i].end
            ? 3
            : 1
        );

      valueText.text(Math.round(currentValue));

      // Update needle position
      needle
        .transition()
        .duration(50)
        .attr(
          "transform",
          `rotate(${(scale(currentValue) * 180) / Math.PI - 180})`
        );
    });
  }, [currentValue]);

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 600 350"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default ResponsiveGauge;
