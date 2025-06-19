"use client";

import { createContext, useContext, ReactNode } from "react";
import { StructureWithLatLng } from "@/types/structure.type";

// Internal context type with nullable structure
type StructureContextInternalType = {
  structure: StructureWithLatLng | null;
};

// Public context type that guarantees structure is non-null
export type StructureContextType = {
  structure: StructureWithLatLng;
};

// Create the internal context with default value
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
  // Convert from Prisma structure to our custom Structure type
  // Our Structure type already has coordinates defined
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

// Create a hook to use the context
export function useStructureContext(): StructureContextType {
  const context = useContext(StructureContextInternal);

  if (context === undefined) {
    throw new Error(
      "useStructureContext must be used within a StructureProvider"
    );
  }

  // Check if structure is null and throw an error if it is
  if (context.structure === null) {
    throw new Error("Structure is not available");
  }

  // Return the context with the non-null structure
  return { structure: context.structure };
}
