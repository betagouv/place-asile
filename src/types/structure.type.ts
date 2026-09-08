export enum PublicType {
  TOUT_PUBLIC = "Tout public",
  FAMILLE = "Famille",
  PERSONNES_ISOLEES = "Personnes isolées",
}

export enum StructureType {
  CADA = "CADA",
  HUDA = "HUDA",
  CPH = "CPH",
  CAES = "CAES",
}

/** Types conservés en base mais absents de l'application. */
export const EXCLUDED_STRUCTURE_TYPES = ["PRAHDA", "NH"] as const;

export const STRUCTURE_TYPES_DISPLAY_ORDER: StructureType[] = [
  StructureType.CADA,
  StructureType.CAES,
  StructureType.CPH,
  StructureType.HUDA,
];
