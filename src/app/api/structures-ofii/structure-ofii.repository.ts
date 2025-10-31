import { StructureType } from "@prisma/client";

export const findBySearchTerm = async (
  operateurId: string | null,
  departementNumero: string | null,
  type: string | null
): Promise<StructureOfii[]> => {
  if (!operateurId || !departementNumero || !type) {
    return [];
  }
  return [
    {
      dnaCode: "C0001",
      type: "HUDA",
      nom: "Structure 1",
      operateur: "Opérateur 1",
      departement: "Doubs",
    },
    {
      dnaCode: "C0002",
      type: "HUDA",
      nom: "Structure 2",
      operateur: "Opérateur 1",
      departement: "Doubs",
    },
    {
      dnaCode: "C0003",
      type: "HUDA",
      nom: "Structure 3",
      operateur: "Opérateur 2",
      departement: "Doubs",
    },
    {
      dnaCode: "C0004",
      type: "HUDA",
      nom: "Structure 4",
      operateur: "Opérateur 2",
      departement: "Doubs",
    },
    {
      dnaCode: "C0005",
      type: "HUDA",
      nom: "Structure 5",
      operateur: "Opérateur 2",
      departement: "Doubs",
    },
  ];
};

// Temporaire en attendant que la table StructureOfii soit créée
type StructureOfii = {
  dnaCode: string;
  type: StructureType;
  nom: string;
  operateur: string;
  departement: string;
};
