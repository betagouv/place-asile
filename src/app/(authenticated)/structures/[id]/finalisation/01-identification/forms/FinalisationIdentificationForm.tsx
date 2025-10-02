"use client";

import { useRouter } from "next/navigation";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { FieldSetCalendrier } from "@/app/components/forms/fieldsets/structure/FieldSetCalendrier";
import { FieldSetContacts } from "@/app/components/forms/fieldsets/structure/FieldSetContacts";
import { FieldSetDescription } from "@/app/components/forms/fieldsets/structure/FieldSetDescription";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useFormHandling } from "@/app/hooks/useFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValue.util";
import { StructureState } from "@/types/structure.type";

import { getCurrentStepData } from "../../components/Steps";
import { finalisationIdentificationSchema } from "./validation/FinalisationIdentificationSchema";

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

  const router = useRouter();
  const defaultValues = getDefaultValues({ structure, type: "identification" });

  const { handleSubmit, state, backendError } = useFormHandling({
    callback: () => router.push(nextRoute),
  });

  return (
    <>
      <FormWrapper
        schema={finalisationIdentificationSchema}
        defaultValues={defaultValues}
        submitButtonText="Étape suivante"
        previousStep={previousRoute}
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        onSubmit={handleSubmit}
        mode="onChange"
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
