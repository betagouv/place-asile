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
      fileUploadCategory: "arreteAutorisation",
    },
    { label: "CPOM", fileUploadCategory: "cpom" },
    { label: "Conventions", fileUploadCategory: "convention" },
    {
      label: "Arrêtés de tarification",
      fileUploadCategory: "arreteTarification",
    },
    { label: "Autres documents", fileUploadCategory: "autre" },
  ];
  return (
    <Block title="Actes administratifs" iconClass="fr-icon-file-text-line">
      {categories.map((categorie) => (
        <Accordion label={categorie.label} key={categorie.fileUploadCategory}>
          <div className="columns-3">
            {(structure.fileUploads || [])
              ?.filter(
                (fileUpload) =>
                  fileUpload.category === categorie.fileUploadCategory
              )
              .map((fileUpload) => (
                <div key={fileUpload.key} className="pb-5">
                  <DownloadItem fileUpload={fileUpload} />
                </div>
              ))}
          </div>
        </Accordion>
      ))}
    </Block>
  );
};
