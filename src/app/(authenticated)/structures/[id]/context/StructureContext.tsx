import { ReactNode } from "react";
import { StructureWithLatLng } from "@/types/structure.type";
import { StructureClientProvider } from "./StructureClientContext";

export type StructureContextType = {
  structure: StructureWithLatLng;
};

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
    <StructureClientProvider structure={structure}>
      {children}
    </StructureClientProvider>
  );
}
