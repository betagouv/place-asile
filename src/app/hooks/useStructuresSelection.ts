import { useEffect, useState } from "react";

import { StructureMinimalApiType } from "@/schemas/api/structure.schema";

export const useStructuresSelection = ({
  operateurName,
  departementNumero,
  type,
}: Props) => {
  const [structures, setStructures] = useState<
    StructureMinimalApiType[] | undefined
  >(undefined);

  const getStructures = async (
    operateurName: string,
    departementNumero: string,
    type: string
  ): Promise<{
    structures: StructureMinimalApiType[];
    totalStructures: number;
  }> => {
    try {
      const baseUrl = process.env.NEXT_URL || "";
      const params = new URLSearchParams();
      if (operateurName) {
        params.append("operateurs", operateurName);
      }
      if (departementNumero) {
        params.append("departements", departementNumero);
      }
      if (type) {
        params.append("type", type);
      }
      params.append("selection", "true");
      const result = await fetch(
        `${baseUrl}/api/structures?${params.toString()}`
      );

      if (!result.ok) {
        throw new Error(`Failed to fetch structures : ${result.status}`);
      }

      return await result.json();
    } catch (error) {
      console.error("Error fetching structures :", error);
      return { structures: [], totalStructures: 0 };
    }
  };

  useEffect(() => {
    const fetchStructures = async () => {
      const { structures } = await getStructures(
        operateurName,
        departementNumero,
        type
      );
      setStructures(structures);
    };

    if (operateurName && departementNumero && type) {
      fetchStructures();
    }
  }, [operateurName, departementNumero, type]);

  return {
    structures,
  };
};

type Props = {
  operateurName: string;
  departementNumero: string;
  type: string;
};
