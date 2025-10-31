"use client";

import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { ReactElement } from "react";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { PLACE_ASILE_CONTACT_EMAIL } from "@/constants";
import { ajoutStructureSchema } from "@/schemas/forms/ajout/ajoutStructure.schema";

import { BackButton } from "./_components/BackButton";
import { StructureSearch } from "./_components/StructureSearch";
import { ValidationButton } from "./_components/ValidationButton";

export default function AjoutStructurePage(): ReactElement {
  return (
    <FormWrapper
      schema={ajoutStructureSchema}
      availableFooterButtons={[]}
      className="bg-transparent border-none p-0"
      showContactInfos={false}
    >
      <BackButton />
      <div className="max-w-5xl mx-auto mt-12">
        <h2 className="flex items-center gap-3 text-xl font-bold mb-8 text-title-blue-france justify-center">
          <span className="fr-icon-search-line fr-icon--md" />
          Quelle structure voulez-vous ajouter ?
        </h2>
        <Notice
          severity="warning"
          title=""
          className="rounded [&_p]:flex  [&_p]:items-center mb-4"
          description={
            <span className="text-default-grey">
              Si votre structure regroupe plusieurs codes DNA mais est une seule
              entité juridique et/ou financière, veuillez ne pas remplir ce
              formulaire et nous contacter directement par email via{" "}
              {
                <a
                  href={`mailto:${PLACE_ASILE_CONTACT_EMAIL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {PLACE_ASILE_CONTACT_EMAIL}
                </a>
              }
              .
            </span>
          }
        />
        <StructureSearch />
        <p className="text-mention-grey text-sm text-center mb-10">
          Si vous ne trouvez pas votre structure,{" "}
          <a
            href={`mailto:${PLACE_ASILE_CONTACT_EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            contactez-nous par mail
          </a>{" "}
          ou par téléphone (07 86 38 96 85 ou au 06 88 44 20 93)
        </p>
        <ValidationButton />
      </div>
    </FormWrapper>
  );
}
