import { useEffect, useState } from "react";

import { StructureOfiiFormType } from "@/schemas/forms/ajout/ajoutStructure.schema";

export const useStructuresOfiiSearch = ({
  operateurId,
  departementNumero,
  type,
}: Props) => {
  const [structuresOfii, setStructuresOfii] = useState<
    StructureOfiiFormType[] | undefined
  >(undefined);

  const getStructuresOfii = async (
    operateurId: string,
    departementNumero: string,
    type: string
  ): Promise<StructureOfiiFormType[]> => {
    try {
      const baseUrl = process.env.NEXT_URL || "";
      const result = await fetch(
        `${baseUrl}/api/structures-ofii?operateur=${operateurId}&departement=${departementNumero}&type=${type}`
      );

      if (!result.ok) {
        throw new Error(`Failed to fetch structures ofii: ${result.status}`);
      }

      return await result.json();
    } catch (error) {
      console.error("Error fetching structures ofii:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchStructuresOfii = async () => {
      const structuresOfii = await getStructuresOfii(
        operateurId,
        departementNumero,
        type
      );
      setStructuresOfii(structuresOfii);
    };

    if (operateurId && departementNumero && type) {
      fetchStructuresOfii();
    }
  }, [operateurId, departementNumero, type]);

  return {
    structuresOfii,
  };
};

type Props = {
  operateurId: string;
  departementNumero: string;
  type: string;
};
