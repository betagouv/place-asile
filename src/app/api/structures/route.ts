import { NextRequest, NextResponse } from "next/server";
import { findAll } from "./structure.repository";
import { addCoordinates } from "./structure.service";
import { structureCreationSchema } from "./structure.schema";

export async function GET() {
  const structures = await findAll();
  const structuresWithCoordinates = addCoordinates(structures);
  return NextResponse.json(structuresWithCoordinates);
}

export async function POST(request: NextRequest) {
  try {
    const result = structureCreationSchema.parse(request.body);
    console.log(">>>>>>>>>>>", result);
    // TODO: Insert in DB
    return NextResponse.json("Structure créée avec succès", { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
