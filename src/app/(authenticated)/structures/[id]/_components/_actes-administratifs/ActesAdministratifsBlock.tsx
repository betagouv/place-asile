import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";

import { Block } from "@/app/components/common/Block";
import { DownloadItem } from "@/app/components/common/DownloadItem";

import { useStructureContext } from "../../_context/StructureClientContext";

export const ActesAdministratifsBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const router = useRouter();

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
    <Block
      title="Actes administratifs"
      iconClass="fr-icon-file-text-line"
      onEdit={() => {
        router.push(`/structures/${structure.id}/modification/06-documents`);
      }}
    >
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
