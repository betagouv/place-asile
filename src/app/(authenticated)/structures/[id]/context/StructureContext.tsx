"use client";

import { Structure } from "@prisma/client";
import { createContext, useContext, ReactNode } from "react";

// Define the context type
type StructureContextType = {
  structure: Structure | null;
};

// Create the context with default value
const StructureContext = createContext<StructureContextType>({
  structure: null,
});

// Create a provider component
export function StructureProvider({
  children,
  structure,
}: {
  children: ReactNode;
  structure: Structure | null;
}) {
  return (
    <StructureContext.Provider value={{ structure }}>
      {children}
    </StructureContext.Provider>
  );
}

// Create a hook to use the context
export function useStructureContext() {
  const context = useContext(StructureContext);

  if (context === undefined) {
    throw new Error("useStructure must be used within a StructureProvider");
  }

  return context;
}
