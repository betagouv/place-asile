import React from "react";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import Notice from "@codegouvfr/react-dsfr/Notice";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { FileUploadCategory } from "@/types/file-upload.type";
import { useFormContext } from "react-hook-form";
import { useYearRange } from "@/app/hooks/useYearRange";
import { getYearDate } from "@/app/utils/date.util";
import Upload from "@/app/components/forms/Upload";

export const Documents = ({ className }: { className?: string }) => {
  const { structure } = useStructureContext();
  const { register } = useFormContext();
  const { years } = useYearRange();

  const getFileByYearAndCategory = (year: number, category: string) => {
    return structure?.fileUploads?.find((fileUpload) => {
      if (!fileUpload.date) return false;
      const yearStr = String(fileUpload.date).substring(0, 4);

      return Number(yearStr) === year && fileUpload.category === category;
    });
  };

  const requiredDocuments: {
    title: string;
    key: keyof typeof FileUploadCategory;
  }[] = [
    {
      title: "Budget prévisionnel demandé",
      key: "BUDGET_PREVISIONNEL_DEMANDE",
    },
    {
      title: "Rapport budgetaire",
      key: "RAPPORT_BUDGETAIRE",
    },
    {
      title: "Budget prévisionnel retenu (ou exécutoire)",
      key: "BUDGET_PREVISIONNEL_RETENU",
    },
    { title: "Budget rectificatif", key: "BUDGET_RECTIFICATIF" },
    {
      title: "Compte administratif soumis",
      key: "COMPTE_ADMINISTRATIF_SOUMIS",
    },
    { title: "Rapport activité", key: "RAPPORT_ACTIVITE" },
    {
      title: "Compte administratif retenu",
      key: "COMPTE_ADMINISTRATIF_RETENU",
    },
  ];

  let documentsIndex = 0;

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-4 text-title-blue-france">
        Documents administratifs et financiers transmis par l’opérateur
      </h2>
      <Notice
        severity="info"
        title=""
        className="rounded [&_p]:flex  [&_p]:items-center mb-8"
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
      {years.map((year) => (
        <Accordion key={year} label={year}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            {requiredDocuments.map((document) => {
              const file = getFileByYearAndCategory(year, document.key);
              documentsIndex++;
              return (
                <div key={documentsIndex}>
                  <h3 className="text-title-blue-france text-base mb-2">
                    {document.title}
                  </h3>
                  <div>
                    <Upload
                      id={file?.id?.toString() || undefined}
                      value={file?.key.toString() || undefined}
                      {...register(
                        `fileUploads.${documentsIndex}.${file?.key}`
                      )}
                    />
                    <input
                      type="hidden"
                      aria-hidden="true"
                      defaultValue={document.key}
                      {...register(
                        `fileUploads.${documentsIndex}.${file?.key}.category`
                      )}
                    />
                    <input
                      type="hidden"
                      aria-hidden="true"
                      defaultValue={getYearDate(year.toString())}
                      {...register(
                        `fileUploads.${documentsIndex}.${file?.key}.date`
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Accordion>
      ))}
    </div>
  );
};
