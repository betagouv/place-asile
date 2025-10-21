import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FetchState } from "@/types/fetch-state.type";
import { StructureState } from "@/types/structure.type";

import { useStructureContext } from "../(authenticated)/structures/[id]/_context/StructureClientContext";
import { useFetchState } from "../context/FetchStateContext";
import { useStructures } from "./useStructures";

export const useAgentFormHandling = ({
  nextRoute,
}: { nextRoute?: string } = {}) => {
  const router = useRouter();

  const { structure, setStructure } = useStructureContext();

  const { updateAndRefreshStructure } = useStructures();

  const { setFetchState } = useFetchState();

  const [backendError, setBackendError] = useState<string | undefined>(
    undefined
  );

  const handleAutoSave = async (data: FormSubmitData) => {
    setFetchState("structure-save", FetchState.LOADING);

    try {
      const updatedStructure = await updateAndRefreshStructure(
        structure.id,
        data,
        setStructure
      );
      if (updatedStructure === "OK") {
        setFetchState("structure-save", FetchState.IDLE);
      } else {
        console.error(updatedStructure);
        setFetchState("structure-save", FetchState.ERROR);
        setBackendError(updatedStructure?.toString());
        throw new Error(updatedStructure?.toString());
      }
    } catch (error) {
      setFetchState("structure-save", FetchState.ERROR);
      setBackendError(error instanceof Error ? error.message : String(error));
      throw error;
    }
  };

  const handleValidation = async (data: FormSubmitData) => {
    setFetchState("structure-save", FetchState.LOADING);
    console.log("handleValidation", data);
    setFetchState("structure-save", FetchState.IDLE);
  };

  const handleFinalisation = async (callback?: () => void) => {
    setFetchState("structure-save", FetchState.LOADING);
    try {
      const updatedStructure = await updateAndRefreshStructure(
        structure.id,
        { state: StructureState.FINALISE },
        setStructure
      );
      if (updatedStructure === "OK") {
        setFetchState("structure-save", FetchState.IDLE);
        if (callback) {
          callback();
        }
      } else {
        console.error(updatedStructure);
        setFetchState("structure-save", FetchState.ERROR);
        setBackendError(updatedStructure?.toString());
        throw new Error(updatedStructure?.toString());
      }
    } catch (error) {
      setFetchState("structure-save", FetchState.ERROR);
      setBackendError(error instanceof Error ? error.message : String(error));
      throw error;
    }
  };

  const handleSubmit = async (data: FormSubmitData) => {
    setFetchState("structure-save", FetchState.LOADING);

    try {
      const updatedStructure = await updateAndRefreshStructure(
        structure.id,
        data,
        setStructure
      );
      if (updatedStructure === "OK") {
        if (nextRoute) {
          router.push(nextRoute);
        }
      } else {
        console.error(updatedStructure);
        setFetchState("structure-save", FetchState.ERROR);
        setBackendError(updatedStructure?.toString());
        throw new Error(updatedStructure?.toString());
      }
    } catch (error) {
      setFetchState("structure-save", FetchState.ERROR);
      setBackendError(error instanceof Error ? error.message : String(error));
      throw error;
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

export type FormSubmitData = {
  dnaCode?: string;
  [key: string]: unknown;
};
