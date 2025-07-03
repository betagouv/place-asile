"use client";

import { createContext, useContext, ReactNode } from "react";
import { StructureWithLatLng } from "@/types/structure.type";
import { StructureContextType } from "./StructureContext";

type StructureContextInternalType = {
  structure: StructureWithLatLng | null;
};

const StructureContextInternal = createContext<StructureContextInternalType>({
  structure: null,
});

export function StructureClientProvider({
  children,
  structure,
}: {
  children: ReactNode;
  structure: StructureWithLatLng | null;
}) {
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
  return {
    structure: context.structure,
  };
}
