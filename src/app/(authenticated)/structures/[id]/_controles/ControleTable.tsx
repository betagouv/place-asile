import Button from "@codegouvfr/react-dsfr/Button";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { ReactElement } from "react";

import { useFileUpload } from "@/app/hooks/useFileUpload";
import { ControleType } from "@/types/controle.type";

import { useStructureContext } from "../context/StructureClientContext";

export const ControleTable = (): ReactElement => {
  const { structure } = useStructureContext();
  const { getDownloadLink } = useFileUpload();

  const openLink = async (fileUploadKey: string) => {
    const link = await getDownloadLink(fileUploadKey);
    window.open(link);
  };
  console.log(structure?.controles);
  const getControles = () => {
    return structure?.controles?.map((controle) => [
      new Date(controle.date).toLocaleDateString("fr-FR"),
      ControleType[controle.type as unknown as keyof typeof ControleType],
      // TODO : en faire un vrai lien cliquable avec l'attribut download
      <Button
        key={controle.id}
        iconId="fr-icon-eye-line"
        priority="tertiary no outline"
        onClick={() => openLink(controle.fileUploads[0].key)}
      >
        Voir
      </Button>,
    ]);
  };

  return (
    <Table
      bordered={true}
      className="m-0"
      caption=""
      data={getControles() || []}
      headers={["DATE", "TYPE", "RAPPORT"]}
    />
  );
};
