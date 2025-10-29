import { EvaluationApiType } from "@/schemas/api/evaluation.schema";
import { EvaluationFormValues } from "@/schemas/forms/base/evaluation.schema";

export const getEvaluationsDefaultValues = (
  evaluations: EvaluationApiType[] = []
): EvaluationFormValues[] | undefined => {
  return evaluations.map((evaluation) => {
    return {
      ...evaluation,
      date: evaluation.date ?? "",
      notePersonne: evaluation.notePersonne ?? 0,
      notePro: evaluation.notePro ?? 0,
      noteStructure: evaluation.noteStructure ?? 0,
      note: evaluation.note ?? 0,
    };
  });
};

export const transformFormEvaluationsToApiEvaluations = (
  evaluations?: EvaluationFormValues[]
): EvaluationApiType[] | undefined => {
  return evaluations?.map((evaluation) => {
    return {
      ...evaluation,
      id: evaluation.id || undefined,
      fileUploads: evaluation.fileUploads?.filter(
        (fileUpload) =>
          fileUpload?.key !== undefined && fileUpload?.id !== undefined
      ) as { id: number; key: string }[] | undefined,
    };
  });
};
