import { Block } from "@/app/components/common/Block";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ReactElement } from "react";
import { useStructureContext } from "../context/StructureClientContext";
import { DownloadItem } from "@/app/components/common/DownloadItem";

export const ActesAdministratifsBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const categories = [
    {
      label: "Arrêtés d'autorisation",
      // TODO : utiliser l'enum plutôt qu'une string hardcodée
      fileUploadCategory: "ARRETE_AUTORISATION",
      isDisplayed: true,
    },
    {
      label: "CPOM",
      fileUploadCategory: "CPOM",
      isDisplayed: structure.cpom,
    },
    {
      label: "Conventions",
      fileUploadCategory: "CONVENTION",
      isDisplayed: true,
    },
    {
      label: "Arrêtés de tarification",
      fileUploadCategory: "ARRETE_TARIFICATION",
      isDisplayed: true,
    },
    {
      label: "Autres documents",
      fileUploadCategory: "AUTRE",
      isDisplayed: true,
    },
  ];

  const getFileUploadsToDisplay = (categorie: {
    fileUploadCategory: string;
  }) => {
    return (structure.fileUploads || [])?.filter(
      (fileUpload) => fileUpload.category === categorie.fileUploadCategory
    );
  };

  const displayedCategories = categories
    .filter((categorie) => categorie.isDisplayed)
    .filter((categorie) => getFileUploadsToDisplay(categorie)?.length > 0);

  return (
    <Block title="Actes administratifs" iconClass="fr-icon-file-text-line">
      {displayedCategories.length === 0 ? (
        <>Aucun document importé</>
      ) : (
        displayedCategories.map((categorie) => (
          <Accordion label={categorie.label} key={categorie.fileUploadCategory}>
            <div className="columns-3">
              {getFileUploadsToDisplay(categorie).map((fileUpload) => (
                <div key={fileUpload.key} className="pb-5">
                  <DownloadItem fileUpload={fileUpload} />
                </div>
              ))}
            </div>
          </Accordion>
        ))
      )}
    </Block>
  );
};
