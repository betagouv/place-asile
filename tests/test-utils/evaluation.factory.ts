import { Evaluation } from "@/types/evaluation.type";

export const createEvaluation = ({
  id,
  date,
}: CreateEvaluationArgs): Evaluation => {
  return {
    id: id ?? 1,
    structureDnaCode: "C0001",
    date: date ?? new Date("01/02/2022"),
    note: 4,
    notePersonne: 4,
    notePro: 4,
    noteStructure: 4,
    fileUploads: [],
  };
};

type CreateEvaluationArgs = {
  id?: number;
  date?: Date;
};
