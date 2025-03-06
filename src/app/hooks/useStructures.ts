import { Structure } from "@/types/structure.type";
import { useEffect, useState } from "react";

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
