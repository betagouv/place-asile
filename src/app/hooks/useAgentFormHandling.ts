import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FetchState } from "@/types/fetch-state.type";
import { StructureState } from "@/types/structure.type";

import { useStructureContext } from "../(authenticated)/structures/[id]/_context/StructureClientContext";
import { useFetchState } from "../context/FetchStateContext";
import { useStructures } from "./useStructures";

export const useAgentFormHandling = ({
  nextRoute,
  currentStep,
}: Props = {}) => {
  const router = useRouter();

  const { structure, setStructure } = useStructureContext();

  const { updateAndRefreshStructure } = useStructures();

  const { setFetchState } = useFetchState();

  const [backendError, setBackendError] = useState<string | undefined>(
    undefined
  );

  const updateStructure = async (data: FormSubmitData): Promise<void> => {
    setFetchState("structure-save", FetchState.LOADING);

    try {
      const result = await updateAndRefreshStructure(
        structure.id,
        data,
        setStructure
      );

      if (result !== "OK") {
        throw new Error(result?.toString());
      }

      setFetchState("structure-save", FetchState.IDLE);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(errorMessage);
      setFetchState("structure-save", FetchState.ERROR);
      setBackendError(errorMessage);
      throw error;
    }
  };

  const handleAutoSave = async (data: FormSubmitData) => {
    await updateStructure(data);
  };

  const handleValidation = async () => {
    await updateStructure({
      finalisationSteps: [
        ...(structure.finalisationSteps || []).filter(
          (step) => step.label !== currentStep
        ),
        { label: currentStep, completed: true },
      ],
    });
  };

  const handleFinalisation = async () => {
    await updateStructure({ state: StructureState.FINALISE });
  };

  const handleSubmit = async (data: FormSubmitData) => {
    await updateStructure(data);
    if (nextRoute) {
      router.push(nextRoute);
    }
  };

  const [isStructureReadyToFinalise, setIsStructureReadyToFinalise] =
    useState(false);

  useEffect(() => {
    if (structure.finalisationSteps?.every((step) => step.completed)) {
      setIsStructureReadyToFinalise(true);
    } else {
      setIsStructureReadyToFinalise(false);
    }
  }, [structure]);

  return {
    handleSubmit,
    handleAutoSave,
    handleValidation,
    handleFinalisation,
    backendError,
    isStructureReadyToFinalise,
  };
};

export type Props = {
  nextRoute?: string;
  currentStep?: string;
};

export type FormSubmitData = {
  dnaCode?: string;
  [key: string]: unknown;
};
