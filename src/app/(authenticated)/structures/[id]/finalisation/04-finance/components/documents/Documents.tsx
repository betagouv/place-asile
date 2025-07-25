import React from "react";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import Notice from "@codegouvfr/react-dsfr/Notice";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { useFormContext } from "react-hook-form";
import { useYearRange } from "@/app/hooks/useYearRange";
import { getYearDate } from "@/app/utils/date.util";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "./documentsStructures";
import { useDocumentIndex } from "@/app/hooks/useDocumentIndex";
// TODO: globalize this component
import { UploadItem } from "@/app/(password-protected)/ajout-structure/components/UploadItem";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";

export const Documents = ({ className }: { className?: string }) => {
  const { structure } = useStructureContext();
  const { control, register, formState } = useFormContext();
  const isSubventionnee = isStructureSubventionnee(structure?.type);
  const isAutorisee = isStructureAutorisee(structure?.type);

  const { years } = useYearRange();

  const yearsToDisplay = isSubventionnee ? years.slice(2) : years;

  const documents = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  const { getDocumentIndexes } = useDocumentIndex();
  const documentIndexes = getDocumentIndexes(
    years as unknown as string[],
    documents
  );

  const errors = formState.errors;
  const hasErrors = Array.isArray(errors.fileUploads);

  const forceExpanded = hasErrors;

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-4 text-title-blue-france">
        Documents administratifs et financiers transmis par l’opérateur
      </h2>
      <Notice
        severity="info"
        title=""
        className="rounded [&_p]:flex  [&_p]:items-center mb-8 w-fit [&_.fr-notice\_\_desc]:text-text-default-grey"
        description={
          <>
            Taille maximale par fichier : 10 Mo. Formats supportés : pdf, xls,
            xlsx, csv et ods.
            <br />
            <a
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
              href="https://stirling-pdf.framalab.org/compress-pdf?lang=fr_FR"
            >
              Votre fichier est trop lourd ? Compressez-le
            </a>
          </>
        }
      />
      {yearsToDisplay.map((year) => (
        <Accordion
          key={year}
          label={year}
          expanded={forceExpanded}
          onExpandedChange={() => {}}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            {documents.map((document) => {
              const todayYear = new Date().getFullYear();
              if (Number(year) <= todayYear - document.yearIndex) {
                const documentKey = `${document.value}-${year}`;
                const currentDocIndex = documentIndexes[documentKey];

                return (
                  <UploadItem
                    key={`${document.value}-${year}`}
                    title={`${document.label} pour ${year}`}
                    subTitle={document.subLabel}
                  >
                    <UploadWithValidation
                      name={`fileUploads.${currentDocIndex}.key`}
                      id={`fileUploads.${currentDocIndex}.key`}
                      control={control}
                    />
                    <input
                      type="hidden"
                      aria-hidden="true"
                      defaultValue={document.value}
                      {...register(`fileUploads.${currentDocIndex}.category`)}
                    />
                    <input
                      type="hidden"
                      aria-hidden="true"
                      defaultValue={getYearDate(year.toString())}
                      {...register(`fileUploads.${currentDocIndex}.date`)}
                    />
                  </UploadItem>
                );
              }
              return null;
            })}
          </div>
        </Accordion>
      ))}
    </div>
  );
};
