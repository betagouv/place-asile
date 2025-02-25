import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  const centres = await prisma.structure.findMany();
  const centresWithCoordinates = centres.map((centre) => ({
    ...centre,
    coordinates: [centre.latitude, centre.longitude],
  }));
  return NextResponse.json(centresWithCoordinates);
}
