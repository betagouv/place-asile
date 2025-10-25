import { Table } from "@codegouvfr/react-dsfr/Table";
import { ReactElement } from "react";

import { EvaluationApiType } from "@/schemas/api/evaluation.schema";

export const EvaluationTable = ({ evaluations }: Props): ReactElement => {
  const getEvaluations = () => {
    return evaluations.map((evaluation) => [
      new Date(evaluation.date ?? "").toLocaleDateString("fr-FR"),
      evaluation.notePersonne,
      evaluation.notePro,
      evaluation.noteStructure,
      evaluation.note,
    ]);
  };

  return (
    <Table
      bordered={true}
      className="m-0"
      caption=""
      data={getEvaluations()}
      headers={[
        "DATE",
        "LA PERSONNE",
        "LES PROFESSIONNELS",
        "LA STRUCTURE",
        "MOYENNE",
      ]}
    />
  );
};

type Props = {
  evaluations: EvaluationApiType[];
};
