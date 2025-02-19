import { NextRequest, NextResponse } from "next/server";
import centres from "../../../../../scripts/export.json";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const centre = centres.find((centre) => centre.id === Number(id));
  return NextResponse.json(centre);
}
