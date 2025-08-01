"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { StructureWithLatLng } from "@/types/structure.type";
import { StructureContextType } from "./StructureContext";

type StructureContextInternalType = {
  structure: StructureWithLatLng | null;
  setStructure: (s: StructureWithLatLng | null) => void;
};

const StructureContextInternal = createContext<StructureContextInternalType>({
  structure: null,
  setStructure: () => {},
});

export function StructureClientProvider({
  children,
  structure: initialStructure,
}: {
  children: ReactNode;
  structure: StructureWithLatLng | null;
}) {
  const [structure, setStructure] = useState(initialStructure);

  return (
    <StructureContextInternal.Provider value={{ structure, setStructure }}>
      {children}
    </StructureContextInternal.Provider>
  );
}

export function useStructureContext(): StructureContextType & {
  setStructure: (s: StructureWithLatLng | null) => void;
} {
  const context = useContext(StructureContextInternal);

  if (context === undefined) {
    throw new Error(
      "useStructureContext must be used within a StructureProvider"
    );
  }

  if (context.structure === null) {
    throw new Error("Structure is not available");
  }
  return {
    structure: context.structure,
    setStructure: context.setStructure,
  };
}
