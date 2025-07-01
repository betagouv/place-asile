import { ReactElement } from "react";
import { useStructureContext } from "../context/StructureContext";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { DownloadItem } from "@/app/components/common/DownloadItem";

export const DocumentsAdministratifs = (): ReactElement => {
  const { structure } = useStructureContext();

  return (
    <>
      {structure.budgets?.map((budget) => (
        <Accordion label={new Date(budget.date).getFullYear()} key={budget.id}>
          <div className="columns-3">
            {(structure.fileUploads || [])
              ?.filter(
                (fileUpload) =>
                  new Date(fileUpload.date!).getFullYear() ===
                  new Date(budget.date).getFullYear()
              )
              .map((fileUpload) => (
                <div key={fileUpload.key} className="pb-5">
                  <DownloadItem fileUpload={fileUpload} />
                </div>
              ))}
          </div>
        </Accordion>
      ))}
    </>
  );
};
