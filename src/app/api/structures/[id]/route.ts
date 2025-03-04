import { NextRequest, NextResponse } from "next/server";
import { StructureRepository } from "../structure.repository";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const structureRepository = new StructureRepository();
  const structure = await structureRepository.findOne(Number(id));
  return NextResponse.json(structure);
}
