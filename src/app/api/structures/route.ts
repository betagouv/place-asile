import { NextResponse } from "next/server";
import { StructureRepository } from "./structure.repository";
import { Structure } from "@prisma/client";
import { StructureAdministrative, StructureWithLatLng } from "@/types/structure.type";

export async function GET() {
  const structureRepository = new StructureRepository();
  const structures = await structureRepository.findAll();
  const structuresWithCoordinates = addCoordinates(structures);
  const structuresAdministratives = aggreagateStructuresAdministratives(
    structuresWithCoordinates
  );

  return NextResponse.json(structuresAdministratives);
}

const addCoordinates = (structures: Structure[]): StructureWithLatLng[] => {
  return structures.map((structure) => ({
    ...structure,
    latitude: structure.latitude.toNumber(),
    longitude: structure.longitude.toNumber(),
    coordinates: [
      structure.latitude.toNumber(),
      structure.longitude.toNumber(),
    ],
  }));
};

const aggreagateStructuresAdministratives = (
  structures: StructureWithLatLng[]
): StructureAdministrative[] => {
  const structuresAdministratives: StructureAdministrative[] = [];
  for (const structure of structures) {
    const structureInStructuresAdministratives = structuresAdministratives.find(
      (structureAdministrative) =>
        structureAdministrative.adresseOperateur === structure.adresseOperateur
    );
    if (!structureInStructuresAdministratives) {
      const newStructure = {
        adresseOperateur: structure.adresseOperateur,
        id: structure.id,
        operateur: structure.operateur,
        type: structure.type,
        typologie: structure.typologie,
        attachedStructures: [structure],
        coordinates: structure.coordinates,
      };
      structuresAdministratives.push(newStructure);
    } else {
      structureInStructuresAdministratives.attachedStructures.push(structure);
    }
  }

  return structuresAdministratives;
};