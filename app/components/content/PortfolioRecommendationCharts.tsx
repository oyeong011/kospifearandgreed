import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const PortfolioRecommendationCharts = () => {
  const portfolios = [
    {
      title: "1안: 성장 중심 포트폴리오",
      data: [
        { name: "주식", value: 50 },
        { name: "채권", value: 20 },
        { name: "현금", value: 10 },
        { name: "금", value: 10 },
        { name: "채권", value: 10 },
      ],
      description:
        "이 포트폴리오는 높은 수익을 추구하는 투자자에게 적합합니다.",
      pros: [
        "높은 성장 잠재력",
        "장기적으로 인플레이션을 상회하는 수익 가능",
        "다양한 자산 클래스로 위험 분산",
      ],
      cons: [
        "단기적으로 높은 변동성",
        "주식 시장 하락 시 큰 손실 가능성",
        "정기적인 리밸런싱 필요",
      ],
    },
    {
      title: "2안: 안정 중심 포트폴리오",
      data: [
        { name: "채권", value: 30 },
        { name: "주식", value: 40 },
        { name: "현금", value: 5 },
        { name: "금", value: 20 },
      ],
      description:
        "이 포트폴리오는 안정적인 수익을 원하는 투자자에게 적합합니다.",
      pros: [
        "낮은 변동성",
        "안정적인 수익 창출",
        "경제 불확실성에 대한 방어력",
      ],
      cons: [
        "상대적으로 낮은 수익률",
        "인플레이션에 취약할 수 있음",
        "주식 시장 상승 시 상대적으로 낮은 수익",
      ],
    },
  ];

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name } =
      props;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderChart = (portfolio: any) => (
    <div className="w-full p-4">
      <h3 className="text-xl font-semibold mb-2 text-center">
        {portfolio.title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={portfolio.data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {portfolio.data.map((entry: any, index: any) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4">
        <p className="text-sm mb-2">{portfolio.description}</p>
        <div className="flex space-x-4">
          <div className="flex-1">
            <h4 className="font-semibold text-green-600">장점:</h4>
            <ul className="list-disc list-inside text-sm">
              {portfolio.pros.map((pro: any, index: any) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-600">단점:</h4>
            <ul className="list-disc list-inside text-sm">
              {portfolio.cons.map((con: any, index: any) => (
                <li key={index}>{con}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col justify-center items-center">
      {portfolios.map((portfolio, index) => renderChart(portfolio))}
    </div>
  );
};

export default PortfolioRecommendationCharts;
