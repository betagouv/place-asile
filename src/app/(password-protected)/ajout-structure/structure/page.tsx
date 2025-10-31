"use client";

import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { ReactElement } from "react";
import z from "zod";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { PLACE_ASILE_CONTACT_EMAIL } from "@/constants";
import { StructureType } from "@/types/structure.type";

import { StructureSearch } from "./_components/StructureSearch";
import { ValidationButton } from "./_components/ValidationButton";

export default function AjoutStructurePage(): ReactElement {
  return (
    <div className="max-w-4xl mx-auto">
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
      <div>
        <FormWrapper
          schema={z.object({
            departement: z.object({
              numero: z.string(),
              name: z.string(),
            }),
            operateur: z.object({
              id: z.number().optional(),
              name: z.string(),
            }),
            type: z.preprocess(
              (val) => (val === "" ? undefined : val),
              z.nativeEnum(StructureType)
            ),
            structureOfii: z.object({
              dnaCode: z.string(),
              nom: z.string(),
              type: z.nativeEnum(StructureType),
              operateur: z.object({
                id: z.number().optional(),
                name: z.string(),
              }),
              departement: z.string(),
            }),
          })}
          availableFooterButtons={[]}
          className="bg-transparent border-none p-0"
          showContactInfos={false}
        >
          <StructureSearch />
          <ValidationButton />
        </FormWrapper>
      </div>
    </div>
  );
}
