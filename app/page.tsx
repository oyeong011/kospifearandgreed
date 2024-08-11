"use client";
import React, { useState, useEffect } from "react";
import ResponsiveGauge from "./components/ResponsiveGauge";
import LineChart from "./components/LineChart";
import DateRangePicker from "./components/DateRangePicker";
import { getFGScore, getMarketData } from "@/lib/dataProcess";
import SingleDatePicker from "./components/SingleDatePicker";
import PortfolioPieChart from "./components/content/PortfolioPieChart";
import NewsSection from "./components/content/NewsSection";
import Navbar from "./components/Navbar/Navbar";
import PortfolioRecommendationCharts from "./components/content/PortfolioRecommendationCharts";

export default function Dashboard() {
  const [startDate, setStartDate] = useState(new Date("2023-08-01"));
  const [endDate, setEndDate] = useState(new Date("2024-06-31"));
  const [fearGreedIndexDate, setFearGreedIndexDate] = useState(new Date());
  const [fearGreedIndex, setFearGreedIndex] = useState(60);
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
      const fgScore = await getFGScore(fearGreedIndexDate);
      if (fgScore) {
        setFearGreedIndex(fgScore.value);
      }

      const data = await getMarketData(startDate, endDate);
      setMarketData(data);
    };

    fetchData();
  }, [startDate, endDate, fearGreedIndexDate]);

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(new Date(start));
    setEndDate(new Date(end));
  };

  const handleSingleDateChange = async (date: string) => {
    await setFearGreedIndexDate(new Date(date));
    const fgData = await getFGScore(fearGreedIndexDate);
    if (fgData) {
      setFearGreedIndex(fgData.value);
      return;
    }
    setFearGreedIndex(52);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Fear & Greed Index */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
              <div className="flex">
                <h2 className="text-2xl font-semibold mb-4">
                  KOSPI FEAR & GREED INDEX
                </h2>
              </div>
              <ResponsiveGauge value={fearGreedIndex} />
              <SingleDatePicker
                onDateChange={handleSingleDateChange}
                dateData={fearGreedIndexDate.toISOString().split("T")[0]}
              />
            </div>

            {/* Market Trends */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
              <h2 className="text-2xl font-semibold mb-4">
                공포탐욕 지수 지표
              </h2>
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
              {/* <PortfolioPieChart /> */}
              <PortfolioRecommendationCharts />
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
