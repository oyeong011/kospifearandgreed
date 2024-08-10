import { parse } from "csv-parse/sync";

interface DataPoint {
  date: Date;
  value: number;
}

async function readCSV(filename: string): Promise<any[]> {
  const filePath = `/data/${filename}`;
  const response = await fetch(new URL(filePath, import.meta.url));
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
  startDate: Date,
  endDate: Date
): Promise<DataPoint[]> {
  const data = await readCSV("전기간_공탐지.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    value: parseFloat(row.fg_score),
  }));
  return filterDataByDateRange(parsedData, startDate, endDate);
}

export async function getJunkBondDemand(
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

export async function getPCRatio(
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

export async function getMarketMomentum(
  startDate: Date,
  endDate: Date
): Promise<{
  close: DataPoint[];
  ma125: DataPoint[];
}> {
  const data = await readCSV("z_market_momentum_result.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    close: parseFloat(row.종가),
    ma125: parseFloat(row.MA125),
  }));
  const filteredData = filterDataByDateRange(parsedData, startDate, endDate);
  return {
    close: filteredData.map((point) => ({
      date: point.date,
      value: point.close,
    })),
    ma125: filteredData.map((point) => ({
      date: point.date,
      value: point.ma125,
    })),
  };
}

export async function getMarketVolatility(
  startDate: Date,
  endDate: Date
): Promise<{
  close: DataPoint[];
  ma50: DataPoint[];
}> {
  const data = await readCSV("z_market_volatility_result.csv");
  const parsedData = data.map((row) => ({
    date: new Date(row.date),
    close: parseFloat(row.종가),
    ma50: parseFloat(row.MA50),
  }));
  const filteredData = filterDataByDateRange(parsedData, startDate, endDate);
  return {
    close: filteredData.map((point) => ({
      date: point.date,
      value: point.close,
    })),
    ma50: filteredData.map((point) => ({
      date: point.date,
      value: point.ma50,
    })),
  };
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

export async function getSafeHavenDemand(
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
