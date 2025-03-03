import { useEffect, useState } from "react";
import { Structure } from "../../types/structure.type";

export const useStructures = (): Structure[] => {
  const [structures, setStructures] = useState<Structure[]>([]);
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
