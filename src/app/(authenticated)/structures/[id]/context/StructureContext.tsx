import { ReactNode } from "react";
import { StructureWithLatLng } from "@/types/structure.type";
import { StructureClientProvider } from "./StructureClientContext";

export type StructureContextType = {
  structure: StructureWithLatLng;
};

export function StructureProvider({
  children,
  structure: backendStructure,
}: {
  children: ReactNode;
  structure: StructureWithLatLng | null;
}) {
  const structure = backendStructure
    ? ({
        ...backendStructure,
        coordinates: [
          Number(backendStructure.latitude),
          Number(backendStructure.longitude),
        ],
      } as unknown as StructureWithLatLng)
    : null;

  return (
    <StructureClientProvider structure={structure}>
      {children}
    </StructureClientProvider>
  );
}
