import React from "react";
import {
  getFGScore,
  getJunkBondDemand,
  getPCRatio,
  getKRXReturn,
  getMarketMomentum,
  getMarketVolatility,
  getMSI,
  getSafeHavenDemand,
} from "@/lib/dataProcess";
import DateRangePicker from "../components/DateRangePicker";
import ResponsiveGauge from "../components/ResponsiveGauge";
import LineChart from "../components/LineChart";

export default async function Home({ searchParams }) {
  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate)
    : new Date("2008-07-01");
  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate)
    : new Date();

  const [
    fgScore,
    junkBondDemand,
    pcRatio,
    krxReturn,
    marketMomentum,
    marketVolatility,
    msi,
    safeHavenDemand,
  ] = await Promise.all([
    getFGScore(startDate, endDate),
    getJunkBondDemand(startDate, endDate),
    getPCRatio(startDate, endDate),
    getKRXReturn(startDate, endDate),
    getMarketMomentum(startDate, endDate),
    getMarketVolatility(startDate, endDate),
    getMSI(startDate, endDate),
    getSafeHavenDemand(startDate, endDate),
  ]);

  // 최근 FG Score를 가져오거나 기본값 사용
  const getLatestFGScore = () => {
    if (fgScore && fgScore.length > 0) {
      const sortedFgScore = [...fgScore].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      return sortedFgScore[0].value;
    }
    // 데이터가 없는 경우 2024년 7월의 예상 값으로 설정 (예: 50)
    return 50;
  };

  const latestFGScore = getLatestFGScore();

  const renderLineChart = (data, title) => {
    if (!data || data.length === 0) {
      return <div className="text-red-500">No data available for {title}</div>;
    }
    return <LineChart data={data} title={title} showMovingAverage={true} />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Market Fear & Greed Indicators
      </h1>

      <DateRangePicker />

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Overall Fear & Greed Index
        </h2>
        <ResponsiveGauge value={latestFGScore} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderLineChart(fgScore, "Fear & Greed Score")}
        {renderLineChart(junkBondDemand, "Junk Bond Demand")}
        {renderLineChart(pcRatio, "Put/Call Ratio")}
        {renderLineChart(krxReturn, "KRX 52-Week Return")}
        {renderLineChart(marketMomentum?.close, "Market Momentum (Close)")}
        {renderLineChart(marketMomentum?.ma125, "Market Momentum (MA125)")}
        {renderLineChart(marketVolatility?.close, "Market Volatility (Close)")}
        {renderLineChart(marketVolatility?.ma50, "Market Volatility (MA50)")}
        {renderLineChart(msi, "Market Strength Index (MSI)")}
        {renderLineChart(safeHavenDemand, "Safe Haven Demand")}
      </div>
    </div>
  );
}
