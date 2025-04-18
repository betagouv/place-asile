"use client";

import React, { FC, Ref, useEffect, useRef, useState } from "react";
import { Structure } from "@/types/structure.type";
import { DefaultStructure } from "./DefaultStructure";
import { HudaStructure } from "./HudaStructure";
import { StructureType } from "@prisma/client";
import { PrahdaStructure } from "./PrahdaStructure";

export default function StructureContent({ structure }: StructureContentProps) {
  const [structureHeaderHeight, setStructureHeaderHeight] = useState(130);
  const structureHeaderRef = useRef<HTMLDivElement>(null);

  const updateHeaderHeight = () => {
    if (structureHeaderRef.current) {
      const height =
        structureHeaderRef.current.getBoundingClientRect().height + 8;
      setStructureHeaderHeight(height);
    }
  };

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      updateHeaderHeight();
    }, 100);

    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const components: Partial<
    Record<StructureType, FC<StructureComponentProps>>
  > = {
    [StructureType.HUDA]: HudaStructure,
    [StructureType.PRAHDA]: PrahdaStructure,
  };

  const StructureComponent = components[structure.type] || DefaultStructure;

  return (
    <StructureComponent
      structure={structure}
      structureHeaderHeight={structureHeaderHeight}
      structureHeaderRef={structureHeaderRef}
    />
  );
}

type StructureContentProps = {
  structure: Structure;
};

type StructureComponentProps = {
  structure: Structure;
  structureHeaderHeight: number;
  structureHeaderRef: Ref<HTMLDivElement>;
};
