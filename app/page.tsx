"use client";
import React, { useState, useEffect } from "react";
import ResponsiveGauge from "./components/ResponsiveGauge";
import LineChart from "./components/LineChart";
import DateRangePicker from "./components/DateRangePicker";
import { getFGScore, getMarketData } from "@/lib/dataProcess";

export default function Dashboard() {
  const [startDate, setStartDate] = useState(new Date("2023-08-01"));
  const [endDate, setEndDate] = useState(new Date("2024-06-31"));
  const [fearGreedIndex, setFearGreedIndex] = useState(50);
  const [marketData, setMarketData] = useState({
    momentumData: [],
    priceStrengthData: [],
    msiData: [],
    putCallOptionsData: [],
    marketVolatilityData: [],
    safeHavenDemandData: [],
    junkBondDemandData: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const fgScore = await getFGScore(new Date("2024-07-31"));
      if (fgScore) {
        setFearGreedIndex(fgScore.value);
      }

      const data = await getMarketData(startDate, endDate);

      console.log("data", data);
      setMarketData(data);
    };

    fetchData();
  }, [startDate, endDate]);

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(new Date(start));
    setEndDate(new Date(end));
  };

  return (
    <div className="grid grid-cols-[400px_1fr] grid-rows-[auto_1fr] gap-5 p-5 h-screen">
      <div className="col-start-1 row-start-1">
        <h1 className="text-2xl font-bold mb-4">Fear & Greed Index</h1>
        <ResponsiveGauge value={fearGreedIndex} />
        <DateRangePicker
          onDateRangeChange={handleDateRangeChange}
          mockStartDate={startDate.toISOString().split("T")[0]}
          mockEndDate={endDate.toISOString().split("T")[0]}
        />
      </div>

      <div className="col-start-1 row-start-2 overflow-y-auto pr-5 space-y-8">
        <LineChart
          data={marketData.momentumData}
          showMovingAverage={true}
          title="Market Momentum"
        />

        <LineChart
          data={marketData.priceStrengthData}
          showMovingAverage={false}
          title="Stock Price Strength"
        />
        <LineChart
          data={marketData.msiData}
          showMovingAverage={false}
          title="Stock Price Breadth"
        />
        <LineChart
          data={marketData.putCallOptionsData}
          showMovingAverage={false}
          title="Put/Call Options Ratio"
        />
        <LineChart
          data={marketData.marketVolatilityData}
          showMovingAverage={true}
          title="Market Volatility"
        />
        <LineChart
          data={marketData.safeHavenDemandData}
          showMovingAverage={false}
          title="Safe Haven Demand"
        />
        <LineChart
          data={marketData.junkBondDemandData}
          showMovingAverage={false}
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
