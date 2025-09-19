import { Table } from "@codegouvfr/react-dsfr/Table";
import { ReactElement } from "react";

import { useStructureContext } from "../context/StructureClientContext";

export const EIGTable = (): ReactElement => {
  const { structure } = useStructureContext();
  const evenementsIndesirablesGraves = structure?.evenementsIndesirablesGraves;

  const getEvenementsIndesirablesGraves = () => {
    return evenementsIndesirablesGraves?.map((evenementIndesirableGrave) => [
      evenementIndesirableGrave.numeroDossier,
      new Date(evenementIndesirableGrave.evenementDate).toLocaleDateString(),
      new Date(evenementIndesirableGrave.declarationDate).toLocaleDateString(),
      evenementIndesirableGrave.type,
    ]);
  };

  return (
    <Table
      bordered={true}
      className="m-0"
      caption=""
      data={getEvenementsIndesirablesGraves() || []}
      headers={["DOSSIER", "ÉVÉNEMENT", "DÉCLARATION", "NATURE DE L'INCIDENT"]}
    />
  );
};
