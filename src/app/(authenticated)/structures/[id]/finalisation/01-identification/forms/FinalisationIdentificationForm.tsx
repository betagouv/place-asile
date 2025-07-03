"use client";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { FieldSetDescription } from "@/app/components/forms/fieldsets/structure/FieldSetDescription";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { finalisationIdentificationSchema } from "./validation/FinalisationIdentificationSchema";
import { PublicType } from "@/types/structure.type";
import { FieldSetContacts } from "@/app/components/forms/fieldsets/structure/FieldSetContacts";
import dayjs from "dayjs";
import { FieldSetCalendrier } from "@/app/components/forms/fieldsets/structure/FieldSetCalendrier";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { getCurrentStepData } from "../../components/Steps";

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

  const formatDateString = (
    dateValue: Date | string | null | undefined,
    defaultValue: string = ""
  ): string => {
    if (!dateValue) return defaultValue;
    const date = dayjs(dateValue);
    return date.isValid() ? date.format("DD/MM/YYYY") : defaultValue;
  };

  const isAuthorized = isStructureAutorisee(structure.type);

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

  return (
    <FormWrapper
      schema={finalisationIdentificationSchema}
      nextRoute={nextRoute}
      defaultValues={defaultValues}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={["submit"]}
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
    </FormWrapper>
  );
}
