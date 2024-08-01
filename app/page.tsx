"use client";
import React from "react";
import ResponsiveGauge from "./components/ResponsiveGauge";
import LineChart from "./components/LineChart";

const getDates = (startDate, endDate) => {
  let dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const dates = getDates(new Date("2023-08-01"), new Date("2024-07-31"));

// 1. 시장 모멘텀 (S&P 500 지수와 125일 이동평균 비교)
const momentumData = dates.map((date, index) => {
  const baseValue = 4300 + Math.sin(index / 30) * 200 + index / 2;
  return {
    date: date,
    value: baseValue + Math.random() * 50 - 25,
    ma: baseValue - 100 + Math.random() * 20 - 10,
  };
});

// 2. 주가 강도 (S&P 500 중 신고가/신저가 비율)
const priceStrengthData = dates.map((date, index) => ({
  date: date,
  value: 0.5 + Math.sin(index / 60) * 0.3 + Math.random() * 0.2,
}));

// 3. 주가 폭 (상승 종목 대비 하락 종목 수)
const priceBreadthData = dates.map((date, index) => ({
  date: date,
  value: 1 + Math.sin(index / 45) * 0.5 + Math.random() * 0.3,
}));

// 4. 풋/콜 옵션 비율
const putCallOptionsData = dates.map((date, index) => {
  const baseValue = 0.95 + Math.sin(index / 90) * 0.1;
  return {
    date: date,
    value: baseValue + Math.random() * 0.1 - 0.05,
    ma: baseValue + 0.02 + Math.random() * 0.04 - 0.02,
  };
});

// 5. 시장 변동성 (VIX)
const marketVolatilityData = dates.map((date, index) => {
  const baseValue = 16 + Math.sin(index / 60) * 3;
  return {
    date: date,
    value: baseValue + Math.random() * 2 - 1,
    ma: baseValue + 0.5 + Math.random() * 1 - 0.5,
  };
});

// 6. 안전자산 수요 (국채 수익률 스프레드)
const safeHavenDemandData = dates.map((date, index) => ({
  date: date,
  value: 1.5 + Math.sin(index / 75) * 0.5 + Math.random() * 0.3 - 0.15,
}));

// 7. 정크본드 수요 (정크본드와 투자등급 채권 스프레드)
const junkBondDemandData = dates.map((date, index) => ({
  date: date,
  value: 3.9 + Math.sin(index / 90) * 0.2 + Math.random() * 0.2 - 0.1,
}));

export default function Dashboard() {
  const fearGreedIndex = 45; // Example value, replace with actual data

  return (
    <div className="grid grid-cols-[400px_1fr] grid-rows-[auto_1fr] gap-5 p-5 h-screen">
      <div className="col-start-1 row-start-1">
        <h1 className="text-2xl font-bold mb-4">Fear & Greed Index</h1>
        <ResponsiveGauge value={fearGreedIndex} />
      </div>

      <div className="col-start-1 row-start-2 overflow-y-auto pr-5 space-y-8">
        <LineChart
          data={momentumData}
          showMovingAverage={true}
          title="Market Momentum"
        />
        <LineChart
          data={priceStrengthData}
          showMovingAverage={false}
          title="Stock Price Strength"
        />
        <LineChart
          data={priceBreadthData}
          showMovingAverage={true}
          title="Stock Price Breadth"
        />
        <LineChart
          data={putCallOptionsData}
          showMovingAverage={false}
          title="Put/Call Options Ratio"
        />
        <LineChart
          data={marketVolatilityData}
          showMovingAverage={true}
          title="Market Volatility"
        />
        <LineChart
          data={safeHavenDemandData}
          showMovingAverage={false}
          title="Safe Haven Demand"
        />
        <LineChart
          data={junkBondDemandData}
          showMovingAverage={true}
          title="Junk Bond Demand"
        />
      </div>

      <div className="col-start-2 row-span-2 pl-5 border-l border-gray-300">
        <h2 className="text-xl font-semibold mb-4">포트폴리오 추천</h2>
        <p>준비 중입니다...</p>
      </div>
    </div>
  );
}
