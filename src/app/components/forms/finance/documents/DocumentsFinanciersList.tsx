import { fr } from "@codegouvfr/react-dsfr";
import { ReactElement } from "react";

import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "@/app/components/forms/finance/documents/documentsStructures";

import { DocumentsFinanciersCategory } from "./DocumentsFinanciersCategory";

export const DocumentsFinanciersList = ({
  isAutorisee,
  year,
}: Props): ReactElement => {
  const documentTypes = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  return (
    <div className={fr.cx("fr-accordions-group")}>
      {documentTypes.map((documentType) => (
        <DocumentsFinanciersCategory
          documentType={documentType}
          key={documentType.value}
          year={year}
        />
      ))}
    </div>
  );
};

type Props = {
  isAutorisee: boolean;
  year: number;
};
