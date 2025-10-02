import { useState } from "react";

import { Contact } from "@/types/contact.type";

import { useStructureContext } from "../(authenticated)/structures/[id]/context/StructureClientContext";
import { useStructures } from "./useStructures";

export const useFormHandling = ({ callback }: { callback: () => void }) => {
  const { structure, setStructure } = useStructureContext();

  const { updateAndRefreshStructure } = useStructures();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [backendError, setBackendError] = useState<string | undefined>("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    const contacts = data.contacts.filter((contact: Contact) =>
      Object.values(contact).every((field) => field !== undefined)
    );
    setState("loading");
    const updatedStructure = await updateAndRefreshStructure(
      structure.id,
      { ...data, contacts },
      setStructure
    );
    if (updatedStructure === "OK") {
      callback();
    } else {
      setState("error");
      setBackendError(updatedStructure?.toString());
      throw new Error(updatedStructure?.toString());
    }
  };

  return {
    handleSubmit,
    state,
    backendError,
  };
};
