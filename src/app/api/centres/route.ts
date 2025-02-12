import { NextResponse } from "next/server";
// import { centres } from "../data/centres.data";
import centres from "../../../../scripts/export-76.json";

export async function GET() {
  console.log(">>>>>>>>>>>>>><", centres);
  return NextResponse.json(centres);
}
