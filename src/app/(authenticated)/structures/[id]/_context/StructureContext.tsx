import { ReactNode } from "react";

import { StructureApiType } from "@/schemas/api/structure.schema";

import { StructureClientProvider } from "./StructureClientContext";

export type StructureContextType = {
  structure: StructureApiType;
};

export function StructureProvider({
  children,
  structure: backendStructure,
}: {
  children: ReactNode;
  structure: StructureApiType | null;
}) {
  const structure = backendStructure
    ? ({
        ...backendStructure,
        coordinates: [
          Number(backendStructure.latitude),
          Number(backendStructure.longitude),
        ],
      } as unknown as StructureApiType)
    : null;

  return (
    <StructureClientProvider structure={structure}>
      {children}
    </StructureClientProvider>
  );
}
