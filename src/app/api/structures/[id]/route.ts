import { NextRequest, NextResponse } from "next/server";
import { findOne } from "../structure.repository";
import { addPlacesIndues, StructureWithActivites } from "../structure.service";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const structure = await findOne(Number(id));
  const structureWithPlacesIndues = addPlacesIndues(
    structure as StructureWithActivites
  );
  return NextResponse.json(structureWithPlacesIndues);
}
