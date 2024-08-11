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
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-yellow-500">KB Dashboard</div>
          <div className="space-x-4">
            <a href="#" className="text-gray-600 hover:text-yellow-500">
              개인
            </a>
            <a href="#" className="text-gray-600 hover:text-yellow-500">
              기업
            </a>
            <a href="#" className="text-gray-600 hover:text-yellow-500">
              금융상품
            </a>
            <a href="#" className="text-gray-600 hover:text-yellow-500">
              자산관리
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Fear & Greed Index */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
              <h2 className="text-2xl font-semibold mb-4">
                Fear & Greed Index
              </h2>
              <ResponsiveGauge value={fearGreedIndex} />
              <SingleDatePicker onDateChange={handleSingleDateChange} />
            </div>

            {/* Market Trends */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
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

          {/* Right Column */}
          <div className="space-y-8">
            {/* Portfolio Recommendation */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
              <h2 className="text-2xl font-semibold mb-4">
                AI가 포트폴리오를 추천해줬어요!
              </h2>
              <PortfolioPieChart />
            </div>

            {/* Latest News */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
              <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
              <NewsSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
