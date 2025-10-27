import { EvaluationApiType } from "@/schemas/api/evaluation.schema";

export const getEvaluationsDefaultValues = (
  evaluations: EvaluationApiType[] = []
) => {
  return evaluations.map((evaluation) => {
    return {
      ...evaluation,
      date: evaluation.date,
    };
  });
};
