"use client";

import { ReactElement } from "react";
import { StructureType } from "@/types/structure.type";
import { DefaultStructure } from "./DefaultStructure";
import { HudaStructure } from "./HudaStructure";
import { PrahdaStructure } from "./PrahdaStructure";
import { useStructureContext } from "./context/StructureClientContext";

export default function StructureContent() {
  const { structure } = useStructureContext();

  const components: Partial<Record<StructureType, () => ReactElement>> = {
    [StructureType.HUDA]: HudaStructure,
    [StructureType.PRAHDA]: PrahdaStructure,
  };
  const StructureComponent = components[structure.type] || DefaultStructure;
  return <StructureComponent />;
}
