"use client";

import { ReactElement } from "react";

import { StructureType } from "@/types/structure.type";

import { useStructureContext } from "../_context/StructureClientContext";
import { PrahdaStructure } from "./PrahdaStructure";
import { Structure } from "./Structure";

export default function StructureContent() {
  const { structure } = useStructureContext();

  const components: Partial<Record<StructureType, () => ReactElement>> = {
    [StructureType.PRAHDA]: PrahdaStructure,
  };
  const StructureComponent =
    structure.type && components[structure.type]
      ? components[structure.type]!
      : Structure;
  return <StructureComponent />;
}
