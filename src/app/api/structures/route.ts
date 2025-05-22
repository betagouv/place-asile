import { NextRequest, NextResponse } from "next/server";
import { createOne, findAll } from "./structure.repository";
import { addCoordinates } from "./structure.service";
import { structureCreationSchema } from "./structure.schema";

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
    console.log("==========", error);
    // TODO : renvoyer les erreurs de zod dans un format utilisable par le front
    return NextResponse.json(error, { status: 400 });
  }
}
