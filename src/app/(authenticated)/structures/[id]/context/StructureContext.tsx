"use client";

// Import the custom Structure type
import { Structure } from "@/types/structure.type";
import { createContext, useContext, ReactNode } from "react";
// Import the Prisma Structure type for conversion
import { Structure as PrismaStructure } from "@prisma/client";

// Internal context type with nullable structure
type StructureContextInternalType = {
  structure: Structure | null;
};

// Public context type that guarantees structure is non-null
export type StructureContextType = {
  structure: Structure;
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
  structure: PrismaStructure | null;
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
      } as unknown as Structure)
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
