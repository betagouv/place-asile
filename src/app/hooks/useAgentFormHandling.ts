import { useRouter } from "next/navigation";
import { useState } from "react";

import { FormAdresse } from "@/schemas/base/adresse.schema";

import { useStructureContext } from "../(authenticated)/structures/[id]/context/StructureClientContext";
import { useStructures } from "./useStructures";

export type FormSubmitData = {
  dnaCode?: string;
  [key: string]: unknown;
};

export const useAgentFormHandling = ({ nextRoute }: { nextRoute?: string }) => {
  const router = useRouter();

  const { structure, setStructure } = useStructureContext();

  const { updateAndRefreshStructure, transformFormAdressesToApiAdresses } =
    useStructures();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [backendError, setBackendError] = useState<string | undefined>(
    undefined
  );

  const handleSubmit = async (data: FormSubmitData) => {
    setState("loading");
    try {
      const adresses = transformFormAdressesToApiAdresses(
        data.adresses as FormAdresse[]
      );
      const updatedStructure = await updateAndRefreshStructure(
        structure.id,
        { ...data, adresses },
        setStructure
      );
      if (updatedStructure === "OK") {
        if (nextRoute) {
          router.push(nextRoute);
        }
      } else {
        console.error(updatedStructure);
        setState("error");
        setBackendError(updatedStructure?.toString());
        throw new Error(updatedStructure?.toString());
      }
    } catch (error) {
      setState("error");
      setBackendError(error instanceof Error ? error.message : String(error));
      throw error;
    }
  };

  return {
    handleSubmit,
    state,
    backendError,
  };
};
