import { useEffect, useState } from "react";

import { StructureSelectionFormType } from "@/schemas/forms/ajout/ajoutStructure.schema";

export const useStructuresSelection = ({
  operateurId,
  departementNumero,
  type,
}: Props) => {
  const [structures, setStructures] = useState<
    StructureSelectionFormType[] | undefined
  >(undefined);

  const getStructures = async (
    operateurId: string,
    departementNumero: string,
    type: string
  ): Promise<StructureSelectionFormType[]> => {
    try {
      const baseUrl = process.env.NEXT_URL || "";
      const params = new URLSearchParams();
      if (operateurId) {
        params.append("operateur", operateurId);
      }
      if (departementNumero) {
        params.append("departement", departementNumero);
      }
      if (type) {
        params.append("type", type);
      }
      const result = await fetch(
        `${baseUrl}/api/structures?${params.toString()}`
      );

      if (!result.ok) {
        throw new Error(`Failed to fetch structures : ${result.status}`);
      }

      return await result.json();
    } catch (error) {
      console.error("Error fetching structures :", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchStructures = async () => {
      const structures = await getStructures(
        operateurId,
        departementNumero,
        type
      );
      setStructures(structures);
    };

    if (operateurId && departementNumero && type) {
      fetchStructures();
    }
  }, [operateurId, departementNumero, type]);

  return {
    structures,
  };
};

type Props = {
  operateurId: string;
  departementNumero: string;
  type: string;
};
