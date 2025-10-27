import { Evaluation } from "@/types/evaluation.type";

export const getEvaluationsDefaultValues = (evaluations: Evaluation[] = []) => {
  return evaluations.map((evaluation) => {
    return {
      ...evaluation,
      date:
        evaluation.date && evaluation.date instanceof Date
          ? evaluation.date.toISOString()
          : evaluation.date || undefined,
    };
  });
};
