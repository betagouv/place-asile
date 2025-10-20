import { useFormContext } from "react-hook-form";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
// TODO: globalize this component
import { UploadItem } from "@/app/(password-protected)/ajout-structure/components/UploadItem";
import { MaxSizeNotice } from "@/app/components/forms/MaxSizeNotice";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import { getYearRange } from "@/app/utils/date.util";
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
  const { control, register } = useFormContext();
  const isSubventionnee = isStructureSubventionnee(structure?.type);
  const isAutorisee = isStructureAutorisee(structure?.type);

  const { years } = getYearRange();

  const yearsToDisplay = isSubventionnee ? years.slice(2) : years;

  const documents = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  const documentIndexes = getDocumentIndexes(years.map(String), documents);

  return (
    <div className={className}>
      <MaxSizeNotice />
      {yearsToDisplay.map((year) => (
        <div key={year} className="mb-7">
          <h2 className="text-xl font-bold mb-4 text-title-blue-france">
            {year}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 gap-y-8 mb-8">
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
                      className="[*]:!justify-start p-4 min-h-0"
                    />
                    <input
                      type="hidden"
                      aria-hidden="true"
                      {...register(`fileUploads.${currentDocIndex}.category`)}
                    />
                    <input
                      type="hidden"
                      aria-hidden="true"
                      {...register(`fileUploads.${currentDocIndex}.date`)}
                    />
                  </UploadItem>
                );
              }
              return null;
            })}
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};
