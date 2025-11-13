import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { StructureApiType } from "@/schemas/api/structure.schema";
import { Repartition } from "@/types/adresse.type";
import { FetchState } from "@/types/fetch-state.type";
import { StructureType } from "@/types/structure.type";

import { useFetchState } from "../context/FetchStateContext";

export const useStructureSearch = () => {
  const [structures, setStructures] = useState<StructureApiType[] | undefined>(
    undefined
  );
  const [totalStructures, setTotalStructures] = useState<number>(0);

  const { setFetchState } = useFetchState();

  const searchParams = useSearchParams();
  const page: string | null = searchParams.get("page");
  const search: string | null = searchParams.get("search");
  const type: StructureType | null = searchParams.get(
    "type"
  ) as StructureType | null;
  const bati: Repartition | null = searchParams.get(
    "bati"
  ) as Repartition | null;
  const placeAutorisees: string | null = searchParams.get("placeAutorisees");
  const departements: string | null = searchParams.get("departements");

  const getStructures = useCallback(
    async (
      page: string | null,
      search: string | null,
      type: StructureType | null,
      bati: Repartition | null,
      placeAutorisees: string | null,
      departements: string | null
    ): Promise<{ structures: StructureApiType[]; totalStructures: number }> => {
      console.log("getStructures");
      setFetchState("structure-search", FetchState.LOADING);
      try {
        const baseUrl = process.env.NEXT_URL || "";
        const params = new URLSearchParams();
        if (page) {
          params.append("page", String(page));
        }
        if (search) {
          params.append("search", search);
        }
        if (type) {
          params.append("type", type);
        }
        if (bati) {
          params.append("bati", bati);
        }
        if (placeAutorisees != null) {
          params.append("placeAutorisees", String(placeAutorisees));
        }
        if (departements) {
          {
            params.append("departements", departements);
          }
        }
        const result = await fetch(
          `${baseUrl}/api/structures?${params.toString()}`
        );

        if (!result.ok) {
          setFetchState("structure-search", FetchState.ERROR);
          throw new Error(`Failed to fetch structures ofii: ${result.status}`);
        }
        setFetchState("structure-search", FetchState.IDLE);
        return await result.json();
      } catch (error) {
        console.error("Error fetching structures ofii:", error);
        setFetchState("structure-search", FetchState.ERROR);
        return { structures: [], totalStructures: 0 };
      }
    },
    [setFetchState]
  );

  useEffect(() => {
    const fetchStructures = async () => {
      const { structures, totalStructures } = await getStructures(
        page,
        search,
        type,
        bati,
        placeAutorisees,
        departements
      );
      setStructures(structures);
      setTotalStructures(totalStructures);
    };

    fetchStructures();
  }, [page, search, type, bati, placeAutorisees, departements, getStructures]);

  return {
    structures,
    totalStructures,
  };
};
