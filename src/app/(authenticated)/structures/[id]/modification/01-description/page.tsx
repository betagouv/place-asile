"use client";

import Notice from "@codegouvfr/react-dsfr/Notice";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { FieldSetAdresseAdministrative } from "@/app/components/forms/fieldsets/structure/FieldSetAdresseAdministrative";
import { FieldSetContacts } from "@/app/components/forms/fieldsets/structure/FieldSetContacts";
import { FieldSetDescription } from "@/app/components/forms/fieldsets/structure/FieldSetDescription";
import { FieldSetHebergement } from "@/app/components/forms/fieldsets/structure/FieldSetHebergement";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { modificationDescriptionSchema } from "@/schemas/modification/modificationDescription.schema";

import { ModificationTitle } from "../components/ModificationTitle";

export default function ModificationDescription() {
  const { structure } = useStructureContext();

  const { handleSubmit, state, backendError } = useAgentFormHandling({
    nextRoute: `/structures/${structure.id}`,
  });

  const defaultValues = getDefaultValues({ structure });

  return (
    <>
      <ModificationTitle
        step="Description"
        closeLink={`/structures/${structure.id}`}
      />
      <FormWrapper
        schema={modificationDescriptionSchema}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        mode="onChange"
        resetRoute={`/structures/${structure.id}`}
        submitButtonText="Valider"
        availableFooterButtons={[
          FooterButtonType.CANCEL,
          FooterButtonType.SUBMIT,
        ]}
        className="border-[2px] border-solid border-[var(--text-title-blue-france)]"
      >
        <Notice
          severity="warning"
          title=""
          description="Certaines données (date de création, code DNA, type de structure, opérateur) ne sont pas modifiables. Il y a une erreur ? Contactez-nous."
        />
        <FieldSetDescription
          dnaCode={structure.dnaCode}
          formKind="modification"
        />
        <hr />
        <FieldSetContacts />
        <hr />
        <h2 className="text-xl font-bold mb-0 text-title-blue-france">
          Adresses
        </h2>
        <Notice
          severity="info"
          title=""
          description="L'ensemble des adresses sont des données sensibles qui sont protégées selon les normes du gouvernement. Elles ne seront communiquées qu'aux agents et agentes de DDETS."
        />
        <FieldSetAdresseAdministrative formKind="modification" />
        <FieldSetHebergement />
      </FormWrapper>
      {state === "error" && (
        <SubmitError
          structureDnaCode={structure.dnaCode}
          backendError={backendError}
        />
      )}
    </>
  );
}
