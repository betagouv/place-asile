import { NextResponse } from "next/server";
import { centres } from "../data/centres.data";

export async function GET() {
  return NextResponse.json(centres);
}
