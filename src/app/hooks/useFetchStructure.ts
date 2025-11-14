import { useEffect, useState } from "react";

import { StructureApiType } from "@/schemas/api/structure.schema";

export const useFetchStructure = (id: number) => {
  const [structure, setStructure] = useState<StructureApiType | undefined>(
    undefined
  );

  const getStructure = async (
    id: number
  ): Promise<StructureApiType | undefined> => {
    try {
      const baseUrl = process.env.NEXT_URL || "";
      const result = await fetch(`${baseUrl}/api/structures/${id}`);

      if (!result.ok) {
        throw new Error(`Failed to fetch structure: ${result.status}`);
      }

      return await result.json();
    } catch (error) {
      console.error("Error fetching structure:", error);
      return undefined;
    }
  };

  useEffect(() => {
    const fetchStructure = async () => {
      const structure = await getStructure(id);
      setStructure(structure);
    };

    if (id) {
      fetchStructure();
    }
  }, [id]);

  return {
    structure,
  };
};
