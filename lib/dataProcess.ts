import { parse } from "csv-parse/sync";

interface DataPoint {
  date: Date;
  value: number;
  ma?: number;
}

async function readCSV(filename: string): Promise<any[]> {
  const response = await fetch(`/data/${filename}`);
  const fileContent = await response.text();
  return parse(fileContent, { columns: true, skip_empty_lines: true });
}

function filterDataByDateRange(
  data: DataPoint[],
  startDate: Date,
  endDate: Date
): DataPoint[] {
  return data.filter(
    (point) => point.date >= startDate && point.date <= endDate
  );
}

export async function getFGScore(
  currentDate: Date
): Promise<DataPoint | undefined> {
  try {
    const data = await readCSV("전기간_공탐지.csv");
    const formattedCurrentDate = currentDate.toISOString().split("T")[0];
    const matchingRow = data.find((row) => row.date === formattedCurrentDate);

    if (matchingRow) {
      return {
        date: new Date(matchingRow.date),
        value: parseFloat(matchingRow.fg_score),
      };
    }
    return undefined;
  } catch (error) {
    console.error("Error in getFGScore:", error);
    return undefined;
  }
}

export async function getMarketData(startDate: Date, endDate: Date) {
  const momentumData = await getMarketMomentum(startDate, endDate);
  const priceStrengthData = await getPriceStrength(startDate, endDate);
  const priceBreadthData = await getPriceBreadth(startDate, endDate);
  const putCallOptionsData = await getPCRatio(startDate, endDate);
  const marketVolatilityData = await getMarketVolatility(startDate, endDate);
  const safeHavenDemandData = await getSafeHavenDemand(startDate, endDate);
  const junkBondDemandData = await getJunkBondDemand(startDate, endDate);

  return {
    momentumData,
    priceStrengthData,
    priceBreadthData,
    putCallOptionsData,
    marketVolatilityData,
    safeHavenDemandData,
    junkBondDemandData,
  };
}

async function getMarketMomentum(
  startDate: Date,
  endDate: Date
): Promise<DataPoint[]> {
  const data = await readCSV("z_market_momentum_result.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    value: parseFloat(row.종가),
    ma: parseFloat(row.MA125),
  }));
  return filterDataByDateRange(parsedData, startDate, endDate);
}

async function getPriceStrength(
  startDate: Date,
  endDate: Date
): Promise<DataPoint[]> {
  const data = await readCSV("z_price_strength.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    value: parseFloat(row.price_strength),
  }));
  return filterDataByDateRange(parsedData, startDate, endDate);
}

async function getPriceBreadth(
  startDate: Date,
  endDate: Date
): Promise<DataPoint[]> {
  const data = await readCSV("z_price_breadth.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    value: parseFloat(row.price_breadth),
  }));
  return filterDataByDateRange(parsedData, startDate, endDate);
}

async function getPCRatio(
  startDate: Date,
  endDate: Date
): Promise<DataPoint[]> {
  const data = await readCSV("z_풋콜옵션.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    value: parseFloat(row["P/C Ratio"]),
  }));
  return filterDataByDateRange(parsedData, startDate, endDate);
}

async function getMarketVolatility(
  startDate: Date,
  endDate: Date
): Promise<DataPoint[]> {
  const data = await readCSV("z_market_volatility_result.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    value: parseFloat(row.종가),
    ma: parseFloat(row.MA50),
  }));
  return filterDataByDateRange(parsedData, startDate, endDate);
}

async function getSafeHavenDemand(
  startDate: Date,
  endDate: Date
): Promise<DataPoint[]> {
  const data = await readCSV("z_safe_haven_demand_result.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    value: parseFloat(row.Safe_Haven_Demand),
  }));
  return filterDataByDateRange(parsedData, startDate, endDate);
}

async function getJunkBondDemand(
  startDate: Date,
  endDate: Date
): Promise<DataPoint[]> {
  const data = await readCSV("z_정크본드2008-2024.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    value: parseFloat(row.z_score_grade),
  }));
  return filterDataByDateRange(parsedData, startDate, endDate);
}

export async function getKRXReturn(
  startDate: Date,
  endDate: Date
): Promise<DataPoint[]> {
  const data = await readCSV("z_krx_52w_rate.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    value: parseFloat(row.return),
  }));
  return filterDataByDateRange(parsedData, startDate, endDate);
}

export async function getMSI(
  startDate: Date,
  endDate: Date
): Promise<DataPoint[]> {
  const data = await readCSV("z_msi.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    value: parseFloat(row.MSI),
  }));
  return filterDataByDateRange(parsedData, startDate, endDate);
}
