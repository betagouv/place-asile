import { NextResponse } from "next/server";
import centres from "../../../../scripts/export.json";

export async function GET() {
  return NextResponse.json(centres);
}
