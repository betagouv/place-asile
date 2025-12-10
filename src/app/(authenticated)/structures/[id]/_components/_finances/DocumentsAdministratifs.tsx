import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ReactElement } from "react";

import { DownloadItem } from "@/app/components/common/DownloadItem";
import { getYearFromDate } from "@/app/utils/date.util";
import { BudgetApiType } from "@/schemas/api/budget.schema";
import {
  DocumentFinancierCategory,
  DocumentFinancierCategoryType,
} from "@/types/file-upload.type";

import { useStructureContext } from "../../_context/StructureClientContext";

export const DocumentsAdministratifs = (): ReactElement => {
  const { structure } = useStructureContext();

  const getDocumentsFinanciersToDisplay = (budget: BudgetApiType) => {
    return (structure.documentsFinanciers || [])?.filter(
      (documentFinancier) => {
        const isSameYear =
          getYearFromDate(documentFinancier.date) === budget.year;
        const isOperateurCategory = DocumentFinancierCategory.includes(
          documentFinancier.category as DocumentFinancierCategoryType[number]
        );
        return isSameYear && isOperateurCategory;
      }
    );
  };

  return (
    <>
      {structure.budgets?.map((budget) => (
        <Accordion label={budget.year} key={budget.id}>
          <div className="columns-3">
            {getDocumentsFinanciersToDisplay(budget)?.length === 0 ? (
              <span>Aucun document importé</span>
            ) : (
              getDocumentsFinanciersToDisplay(budget).map(
                (documentFinancier) => (
                  <div key={documentFinancier.key} className="pb-5">
                    <DownloadItem fileUpload={documentFinancier} />
                  </div>
                )
              )
            )}
          </div>
        </Accordion>
      ))}
    </>
  );
};
