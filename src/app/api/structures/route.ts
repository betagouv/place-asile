import { NextResponse } from "next/server";
import { findAll } from "./structure.repository";
import { Structure } from "@prisma/client";
import {
  StructureWithLatLng,
  StructureType,
  PublicType,
} from "@/types/structure.type";

export async function GET() {
  const structures = await findAll();
  const structuresWithCoordinates = addCoordinates(structures);
  return NextResponse.json(structuresWithCoordinates);
}

const addCoordinates = (structures: Structure[]): StructureWithLatLng[] => {
  return structures.map((structure) => ({
    ...structure,
    latitude: structure.latitude.toNumber(),
    longitude: structure.longitude.toNumber(),
    type: structure.type as StructureType,
    public: structure.public as PublicType,
    coordinates: [
      structure.latitude.toNumber(),
      structure.longitude.toNumber(),
    ],
    placesACreer: structure.placesACreer as number,
    placesAFermer: structure.placesAFermer as number,
    echeancePlacesACreer: structure.echeancePlacesACreer as Date,
    echeancePlacesAFermer: structure.echeancePlacesAFermer as Date,
  }));
};
