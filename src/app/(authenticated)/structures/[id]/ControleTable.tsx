import { ReactElement } from "react";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Controle, ControleType } from "@/types/controle.type";

export const ControleTable = ({ controles }: Props): ReactElement => {
  const getControles = () => {
    return controles.map((controle) => [
      new Date(controle.date).toLocaleDateString(),
      ControleType[controle.type as unknown as keyof typeof ControleType],
    ]);
  };

  return (
    <Table
      bordered={true}
      className="fr-m-0"
      caption=""
      data={getControles()}
      headers={["DATE", "TYPE"]}
    />
  );
};

type Props = {
  controles: Controle[];
};
