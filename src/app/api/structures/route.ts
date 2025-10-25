import { NextRequest, NextResponse } from "next/server";

import {
  structureCreationApiSchema,
  structureUpdateApiSchema,
} from "@/schemas/api/structure.schema";

import { createOne, findAll, updateOne } from "./structure.repository";
import { formatStructuresFromDbToApi } from "./structure.service";

export async function GET() {
  const structures = await findAll();
  const structuresWithCoordinates = formatStructuresFromDbToApi(structures);
  return NextResponse.json(structuresWithCoordinates);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = structureCreationApiSchema.parse(body);
    await createOne(result);
    return NextResponse.json("Structure créée avec succès", { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = structureUpdateApiSchema.parse(body);
    await updateOne(result);
    return NextResponse.json("Structure mise à jour avec succès", {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 400 });
  }
}
