"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { FieldSetCalendrier } from "@/app/components/forms/fieldsets/structure/FieldSetCalendrier";
import { FieldSetContacts } from "@/app/components/forms/fieldsets/structure/FieldSetContacts";
import { FieldSetDescription } from "@/app/components/forms/fieldsets/structure/FieldSetDescription";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useFormatDateString } from "@/app/hooks/useFormatDateString";
import { useStructures } from "@/app/hooks/useStructures";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { Contact } from "@/types/contact.type";
import { PublicType, StructureState } from "@/types/structure.type";

import { getCurrentStepData } from "../../components/Steps";
import { finalisationIdentificationSchema } from "./validation/FinalisationIdentificationSchema";

export default function FinalisationIdentificationForm({
  currentStep,
}: {
  currentStep: number;
}) {
  const { structure, setStructure } = useStructureContext();

  const { nextRoute, previousRoute } = getCurrentStepData(
    currentStep,
    structure.id
  );

  const { formatDateString } = useFormatDateString();

  const isAutorisee = isStructureAutorisee(structure.type);
  const { updateAndRefreshStructure } = useStructures();
  const router = useRouter();
  const defaultValues = {
    ...structure,
    operateur: structure.operateur ?? undefined,
    creationDate: formatDateString(structure.creationDate),
    debutPeriodeAutorisation: isAutorisee
      ? formatDateString(structure.debutPeriodeAutorisation)
      : undefined,
    finPeriodeAutorisation: isAutorisee
      ? formatDateString(structure.finPeriodeAutorisation)
      : undefined,
    debutConvention: formatDateString(structure.debutConvention),
    finConvention: formatDateString(structure.finConvention),
    debutCpom: formatDateString(structure.debutCpom),
    finCpom: formatDateString(structure.finCpom),
    echeancePlacesACreer: structure.echeancePlacesACreer,
    echeancePlacesAFermer: structure.echeancePlacesAFermer,
    contacts: structure.contacts || [],
    finessCode: structure.finessCode || undefined,
    public: structure.public
      ? PublicType[structure.public as string as keyof typeof PublicType]
      : undefined,
    filiale: structure.filiale || undefined,
  };

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
      router.push(nextRoute);
    } else {
      setState("error");
      setBackendError(updatedStructure?.toString());
      throw new Error(updatedStructure?.toString());
    }
  };

  return (
    <>
      <FormWrapper
        schema={finalisationIdentificationSchema}
        defaultValues={defaultValues}
        submitButtonText="Étape suivante"
        previousStep={previousRoute}
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        onSubmit={handleSubmit}
      >
        {structure.state === StructureState.A_FINALISER && (
          <InformationBar
            variant="warning"
            title="À vérifier"
            description="Veuillez vérifier les informations et/ou les documents suivants transmis par l’opérateur."
          />
        )}
        <FieldSetDescription dnaCode={structure.dnaCode} />
        <hr />
        <FieldSetContacts />
        <hr />
        <FieldSetCalendrier />
        {state === "error" && (
          <SubmitError
            structureDnaCode={structure.dnaCode}
            backendError={backendError}
          />
        )}
      </FormWrapper>
    </>
  );
}
