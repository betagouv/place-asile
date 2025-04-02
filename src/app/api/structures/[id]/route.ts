import { NextRequest, NextResponse } from "next/server";
import { findOne } from "../structure.repository";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const structure = await findOne(Number(id));
  return NextResponse.json(structure);
}
