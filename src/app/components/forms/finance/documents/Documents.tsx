import Accordion from "@codegouvfr/react-dsfr/Accordion";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { useFormContext } from "react-hook-form";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
// TODO: globalize this component
import { UploadItem } from "@/app/(password-protected)/ajout-structure/components/UploadItem";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import { getYearRange } from "@/app/utils/date.util";
import { getYearDate } from "@/app/utils/date.util";
import { getDocumentIndexes } from "@/app/utils/getFinanceDocument.util";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";

import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "./documentsStructures";

export const Documents = ({ className }: { className?: string }) => {
  const { structure } = useStructureContext();
  const { control, register, formState } = useFormContext();
  const isSubventionnee = isStructureSubventionnee(structure?.type);
  const isAutorisee = isStructureAutorisee(structure?.type);

  const { years } = getYearRange();

  const yearsToDisplay = isSubventionnee ? years.slice(2) : years;

  const documents = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  const documentIndexes = getDocumentIndexes(years.map(String), documents);

  const errors = formState.errors;
  const hasErrors =
    Array.isArray(errors.fileUploads) && errors.fileUploads.length > 0;

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
          className="[&_.fr-collapse]:bg-alt-blue-france [&_.fr-collapse]:m-0 [&_.fr-collapse]:p-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-8 p-6 ">
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
                      className="[*]:!justify-start p-0 min-h-0 mt-2"
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
