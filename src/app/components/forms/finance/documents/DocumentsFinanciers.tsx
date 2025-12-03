import { fr } from "@codegouvfr/react-dsfr";
import { ReactElement } from "react";
import { Control } from "react-hook-form";

import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "@/app/components/forms/finance/documents/documentsStructures";
import { DocumentsFinanciersFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";

import { DocumentsFinanciersCategory } from "./DocumentsFinanciersCategory";

export const DocumentsFinanciers = ({
  isAutorisee,
  control,
  year,
}: Props): ReactElement => {
  const documentTypes = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  return (
    <div>
      <div className={fr.cx("fr-accordions-group")}>
        {documentTypes.map((documentType) => (
          <DocumentsFinanciersCategory
            documentType={documentType}
            key={documentType.value}
            control={control}
            year={year}
          />
        ))}
      </div>
    </div>
  );
};

type Props = {
  isAutorisee: boolean;
  control: Control<DocumentsFinanciersFlexibleFormValues>;
  year: number;
};
