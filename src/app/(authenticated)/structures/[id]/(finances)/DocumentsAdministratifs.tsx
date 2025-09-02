import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ReactElement } from "react";

import { DownloadItem } from "@/app/components/common/DownloadItem";
import { Budget } from "@/types/budget.type";

import { useStructureContext } from "../context/StructureClientContext";

export const DocumentsAdministratifs = (): ReactElement => {
  const { structure } = useStructureContext();

  const getFileUploadsToDisplay = (budget: Budget) => {
    return (structure.fileUploads || [])?.filter(
      (fileUpload) =>
        new Date(fileUpload.date!).getFullYear() ===
        new Date(budget.date).getFullYear()
    );
  };

  return (
    <>
      {structure.budgets?.map((budget) => (
        <Accordion label={new Date(budget.date).getFullYear()} key={budget.id}>
          <div className="columns-3">
            {getFileUploadsToDisplay(budget)?.length === 0 ? (
              <span>Aucun document importé</span>
            ) : (
              getFileUploadsToDisplay(budget).map((fileUpload) => (
                <div key={fileUpload.key} className="pb-5">
                  <DownloadItem fileUpload={fileUpload} />
                </div>
              ))
            )}
          </div>
        </Accordion>
      ))}
    </>
  );
};
