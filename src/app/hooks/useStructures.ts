import { useEffect, useState } from "react";
import { StructureAdministrative } from "../../types/structure.type";

export const useStructures = (): StructureAdministrative[] => {
  const [structures, setStructures] = useState<StructureAdministrative[]>([]);
  useEffect(() => {
    const getStructures = async () => {
      const result = await fetch("/api/structures");
      const structures = await result.json();
      setStructures(structures);
    };
    getStructures();
  }, []);

  return structures;
};
