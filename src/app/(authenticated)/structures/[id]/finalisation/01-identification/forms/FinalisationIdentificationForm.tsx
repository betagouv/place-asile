"use client";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { FieldSetDescription } from "@/app/components/forms/fieldsets/structure/FieldSetDescription";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureContext";
import { finalisationIdentificationSchema } from "./validation/FinalisationIdentificationSchema";
import { PublicType } from "@/types/structure.type";
import { FieldSetContacts } from "@/app/components/forms/fieldsets/structure/FieldSetContacts";
import dayjs from "dayjs";
import { FieldSetCalendrier } from "@/app/components/forms/fieldsets/structure/FieldSetCalendrier";
import { InformationBar } from "@/app/components/ui/InformationBar";

export default function FinalisationIdentificationForm() {
  const { structure } = useStructureContext();

  // TODO: make it a reusable hook
  const formatDateString = (
    dateValue: Date | string | null | undefined
  ): string => {
    if (!dateValue) return "";
    // Ensure we're parsing the date correctly
    const date = dayjs(dateValue);
    // Only return formatted date if it's valid
    return date.isValid() ? date.format("DD/MM/YYYY") : "";
  };

  // Ensure date fields are properly formatted for validation
  const defaultValues = {
    ...structure,
    creationDate: formatDateString(structure.creationDate),
    debutPeriodeAutorisation: formatDateString(
      structure.debutPeriodeAutorisation
    ),
    finPeriodeAutorisation: formatDateString(structure.finPeriodeAutorisation),
    debutConvention: formatDateString(structure.debutConvention),
    finConvention: formatDateString(structure.finConvention),
    debutCpom: formatDateString(structure.debutCpom),
    finCpom: formatDateString(structure.finCpom),
    echeancePlacesACreer: formatDateString(structure.echeancePlacesACreer),
    echeancePlacesAFermer: formatDateString(structure.echeancePlacesAFermer),
    contacts: structure.contacts || [],
    finessCode: structure.finessCode || undefined,
    public: structure.public
      ? PublicType[structure.public as string as keyof typeof PublicType]
      : undefined,
    filiale: structure.filiale || undefined,
  };

  // Log formatted dates for debugging
  console.log("Formatted dates:", {
    debutPeriodeAutorisation: defaultValues.debutPeriodeAutorisation,
    finPeriodeAutorisation: defaultValues.finPeriodeAutorisation,
  });

  return (
    <FormWrapper
      schema={finalisationIdentificationSchema}
      onSubmit={(values) => {
        console.log("Form submitted with values:", values);
      }}
      defaultValues={defaultValues}
      submitButtonText="Étape suivante"
      previousStep={`/structures/${structure.id}`}
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
