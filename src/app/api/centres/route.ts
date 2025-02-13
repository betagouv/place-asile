import { NextResponse } from "next/server";
import centres from "../../../../scripts/export-76.json";

export async function GET() {
  return NextResponse.json(centres);
}
