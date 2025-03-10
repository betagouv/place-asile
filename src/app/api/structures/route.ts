import { NextResponse } from "next/server";
import { StructureRepository } from "./structure.repository";
import { Structure } from "@prisma/client";
import { Repartition, StructureWithLatLng } from "@/types/structure.type";

export async function GET() {
  const structureRepository = new StructureRepository();
  const structures = await structureRepository.findAllWithLogements();
  const structuresWithCoordinates = addCoordinates(structures);
  return NextResponse.json(structuresWithCoordinates);
}

const addCoordinates = (structures: Structure[]): StructureWithLatLng[] => {
  return structures.map((structure) => ({
    ...structure,
    latitude: structure.latitude.toNumber(),
    longitude: structure.longitude.toNumber(),
    repartition: structure.repartition as Repartition,
    coordinates: [
      structure.latitude.toNumber(),
      structure.longitude.toNumber(),
    ],
  }));
};
