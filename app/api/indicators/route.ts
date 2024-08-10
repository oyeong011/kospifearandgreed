// app/api/indicators/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchIndicators } from "@/lib/fetchIndicators";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get("startDate") || "2000-01-01";
  const endDate =
    searchParams.get("endDate") || new Date().toISOString().split("T")[0];
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "100", 10);

  const indicators = await fetchIndicators(startDate, endDate, page, pageSize);
  return NextResponse.json(indicators);
}
