import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  const structures = await prisma.structure.findMany();
  const structuresWithCoordinates = structures.map((structure) => ({
    ...structure,
    coordinates: [structure.latitude, structure.longitude],
  }));
  return NextResponse.json(structuresWithCoordinates);
}
