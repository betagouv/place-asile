import { NextRequest, NextResponse } from "next/server";

import { createOne, findAll, updateOne } from "./structure.repository";
import {
  structureCreationSchema,
  structureUpdateSchema,
} from "./structure.schema";
import { addCoordinates } from "./structure.service";

export async function GET() {
  const structures = await findAll();
  const structuresWithCoordinates = addCoordinates(structures);
  return NextResponse.json(structuresWithCoordinates);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = structureCreationSchema.parse(body);
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
    const result = structureUpdateSchema.parse(body);
    await updateOne(result);
    return NextResponse.json("Structure mise à jour avec succès", {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 400 });
  }
}
