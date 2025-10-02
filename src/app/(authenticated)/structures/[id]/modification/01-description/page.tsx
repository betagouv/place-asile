"use client";

import Notice from "@codegouvfr/react-dsfr/Notice";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { FieldSetAdresseAdministrative } from "@/app/components/forms/fieldsets/structure/FieldSetAdresseAdministrative";
import { FieldSetContacts } from "@/app/components/forms/fieldsets/structure/FieldSetContacts";
import { FieldSetDescription } from "@/app/components/forms/fieldsets/structure/FieldSetDescription";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { useFormatDateString } from "@/app/hooks/useFormatDateString";
import { useStructures } from "@/app/hooks/useStructures";
import { Repartition } from "@/types/adresse.type";
import { Contact } from "@/types/contact.type";
import { PublicType } from "@/types/structure.type";

import { ModificationTitle } from "../components/ModificationTitle";
import { modificationDescriptionSchema } from "./validation/ModificationDescriptionSchema";

export default function ModificationDescription() {
  const { structure, setStructure } = useStructureContext();

  const {
    formatDateString,
  }: {
    formatDateString: (
      dateValue: Date | string | null | undefined,
      defaultValue?: string
    ) => string;
  } = useFormatDateString();

  const { updateAndRefreshStructure } = useStructures();
  const router = useRouter();
  const defaultValues = {
    ...structure,
    operateur: structure.operateur ?? undefined,
    creationDate: formatDateString(structure.creationDate),
    finessCode: structure.finessCode || undefined,
    public: structure.public
      ? PublicType[structure.public as string as keyof typeof PublicType]
      : undefined,
    filiale: structure.filiale || undefined,
    contacts: structure.contacts || [],
    // Champs d'adresse administrative
    nom: structure.nom || "",
    adresseAdministrativeComplete: `${structure.adresseAdministrative} ${structure.codePostalAdministratif} ${structure.communeAdministrative} ${structure.departementAdministratif}`,
    adresseAdministrative: structure.adresseAdministrative || "",
    codePostalAdministratif: structure.codePostalAdministratif || "",
    communeAdministrative: structure.communeAdministrative || "",
    departementAdministratif: structure.departementAdministratif || "",
    typeBati:
      (structure as { typeBati?: Repartition }).typeBati || Repartition.MIXTE,
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
      router.push(`/structures/${structure.id}`);
    } else {
      setState("error");
      setBackendError(updatedStructure?.toString());
      throw new Error(updatedStructure?.toString());
    }
  };

  return (
    <>
      <ModificationTitle step="Description" />
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
        <FieldSetAdresseAdministrative />
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
