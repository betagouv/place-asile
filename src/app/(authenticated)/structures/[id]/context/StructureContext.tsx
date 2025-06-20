"use client";

import { createContext, useContext, ReactNode } from "react";
import { StructureWithLatLng } from "@/types/structure.type";

type StructureContextInternalType = {
  structure: StructureWithLatLng | null;
};

export type StructureContextType = {
  structure: StructureWithLatLng;
};

const StructureContextInternal = createContext<StructureContextInternalType>({
  structure: null,
});

export function StructureProvider({
  children,
  structure: prismaStructure,
}: {
  children: ReactNode;
  structure: StructureWithLatLng | null;
}) {
  const structure = prismaStructure
    ? ({
        ...prismaStructure,
        coordinates: [
          Number(prismaStructure.latitude),
          Number(prismaStructure.longitude),
        ],
      } as unknown as StructureWithLatLng)
    : null;

  return (
    <StructureContextInternal.Provider value={{ structure }}>
      {children}
    </StructureContextInternal.Provider>
  );
}

export function useStructureContext(): StructureContextType {
  const context = useContext(StructureContextInternal);

  if (context === undefined) {
    throw new Error(
      "useStructureContext must be used within a StructureProvider"
    );
  }

  if (context.structure === null) {
    throw new Error("Structure is not available");
  }
  return { structure: context.structure };
}
