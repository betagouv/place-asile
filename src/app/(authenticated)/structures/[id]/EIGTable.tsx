import { ReactElement } from "react";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { EvenementIndesirableGrave } from "@/types/evenementIndesirableGrave.type";

export const EIGTable = ({
  evenementsIndesirablesGraves,
}: Props): ReactElement => {
  const getEvenementsIndesirablesGraves = () => {
    return evenementsIndesirablesGraves.map((evenementIndesirableGrave) => [
      evenementIndesirableGrave.numeroDossier,
      new Date(evenementIndesirableGrave.evenementDate).toLocaleDateString(),
      new Date(evenementIndesirableGrave.declarationDate).toLocaleDateString(),
      evenementIndesirableGrave.type,
    ]);
  };

  return (
    <Table
      bordered={true}
      className="fr-m-0"
      caption=""
      data={getEvenementsIndesirablesGraves()}
      headers={["DOSSIER", "ÉVÉNEMENT", "DÉCLARATION", "NATURE DE L'INCIDENT"]}
    />
  );
};

type Props = {
  evenementsIndesirablesGraves: EvenementIndesirableGrave[];
};
