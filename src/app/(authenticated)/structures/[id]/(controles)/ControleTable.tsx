import { ReactElement } from "react";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { ControleType } from "@/types/controle.type";
import { useStructureContext } from "../context/StructureContext";

export const ControleTable = (): ReactElement => {
  const { structure } = useStructureContext();
  const getControles = () => {
    return structure?.controles?.map((controle) => [
      new Date(controle.date).toLocaleDateString(),
      ControleType[controle.type as unknown as keyof typeof ControleType],
    ]);
  };

  return (
    <Table
      bordered={true}
      className="fr-m-0"
      caption=""
      data={getControles() || []}
      headers={["DATE", "TYPE"]}
    />
  );
};
