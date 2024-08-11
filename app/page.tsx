"use client";
import React, { useState, useEffect } from "react";
import ResponsiveGauge from "./components/ResponsiveGauge";
import LineChart from "./components/LineChart";
import DateRangePicker from "./components/DateRangePicker";
import { getFGScore, getMarketData } from "@/lib/dataProcess";
import SingleDatePicker from "./components/SingleDatePicker";
import PortfolioPieChart from "./components/content/PortfolioPieChart";
import NewsSection from "./components/content/NewsSection";

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
      setMarketData(data);
    };

    fetchData();
  }, [startDate, endDate]);

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(new Date(start));
    setEndDate(new Date(end));
  };

  const handleSingleDateChange = (date: string) => {
    setFearGreedIndex(50);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Market Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Fear & Greed Index</h2>
            <ResponsiveGauge value={fearGreedIndex} />
            <SingleDatePicker onDateChange={handleSingleDateChange} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Market Trends</h2>
            <DateRangePicker
              onDateRangeChange={handleDateRangeChange}
              mockStartDate={startDate.toISOString().split("T")[0]}
              mockEndDate={endDate.toISOString().split("T")[0]}
            />
            <div className="space-y-8 mt-6">
              {Object.entries(marketData).map(([key, data]) => (
                <LineChart
                  key={key}
                  data={data}
                  showMovingAverage={
                    key === "momentumData" || key === "marketVolatilityData"
                  }
                  title={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              오늘의 추천 포트폴리오 구성
            </h2>
            <PortfolioPieChart />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
            <NewsSection />
          </div>
        </div>
      </div>
    </div>
  );
}
