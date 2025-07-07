"use client";

import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { FieldSetDescription } from "@/app/components/forms/fieldsets/structure/FieldSetDescription";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { finalisationIdentificationSchema } from "./validation/FinalisationIdentificationSchema";
import { PublicType } from "@/types/structure.type";
import { FieldSetContacts } from "@/app/components/forms/fieldsets/structure/FieldSetContacts";
import { useFormatDateString } from "@/app/hooks/useFormatDateString";
import { FieldSetCalendrier } from "@/app/components/forms/fieldsets/structure/FieldSetCalendrier";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { getCurrentStepData } from "../../components/Steps";
import { useStructures } from "@/app/hooks/useStructures";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PLACE_ASILE_CONTACT_EMAIL } from "@/constants";

export default function FinalisationIdentificationForm({
  currentStep,
}: {
  currentStep: number;
}) {
  const { structure } = useStructureContext();

  const { nextRoute, previousRoute } = getCurrentStepData(
    currentStep,
    structure.id
  );

  const { formatDateString } = useFormatDateString();

  const isAuthorized = isStructureAutorisee(structure.type);
  const { updateStructure } = useStructures();
  const router = useRouter();

  const defaultValues = {
    ...structure,
    creationDate: formatDateString(structure.creationDate),
    debutPeriodeAutorisation: isAuthorized
      ? formatDateString(structure.debutPeriodeAutorisation)
      : undefined,
    finPeriodeAutorisation: isAuthorized
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

  // TODO : faire un hook avec ce code
  const getErrorEmail = (error: string | undefined): string => {
    const subject = `Problème avec le formulaire de Place d'asile (code DNA ${structure.dnaCode})`;
    const body = `Bonjour,%0D%0A%0D%0AAjoutez ici des informations supplémentaires...%0D%0A%0D%0ARapport d'erreur: ${error}`;
    return `mailto:${PLACE_ASILE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    setState("loading");
    const updatedStructure = await updateStructure(data);
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
        // nextRoute={nextRoute}
        defaultValues={defaultValues}
        submitButtonText="Étape suivante"
        previousStep={previousRoute}
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        onSubmit={(data) => {
          handleSubmit(data);
        }}
      >
        <InformationBar
          variant="warning"
          title="À vérifier"
          description="Veuillez vérifier les informations et/ou les documents suivants transmis par l’opérateur."
        />
        <FieldSetDescription dnaCode={structure.dnaCode} />
        <hr />
        <FieldSetContacts />
        <hr />
        <FieldSetCalendrier />
        {state === "error" && (
          <div className="flex items-end flex-col">
            <p className="text-default-error m-0 p-0">
              Une erreur s’est produite.{" "}
              <a
                href={getErrorEmail(backendError)}
                className="underline"
                target="_blank"
              >
                Nous prévenir
              </a>
            </p>
          </div>
        )}
      </FormWrapper>
    </>
  );
}
