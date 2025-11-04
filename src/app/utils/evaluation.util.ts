import { EvaluationApiType } from "@/schemas/api/evaluation.schema";
import { EvaluationFormValues } from "@/schemas/forms/base/evaluation.schema";

export const getEvaluationsDefaultValues = (
  evaluations: EvaluationApiType[] = [],
  isAutorisee: boolean
): EvaluationFormValues[] | undefined => {
  const defaultValuesFromDb = evaluations.map((evaluation) => {
    return {
      id: evaluation.id ?? undefined,
      date: evaluation.date ?? "",
      notePersonne: evaluation.notePersonne ?? 0,
      notePro: evaluation.notePro ?? 0,
      noteStructure: evaluation.noteStructure ?? 0,
      note: evaluation.note ?? 0,
    };
  });

  if (defaultValuesFromDb.length === 0 && isAutorisee) {
    const emptyEvaluation = {
      date: "",
      notePersonne: null,
      notePro: null,
      noteStructure: null,
      note: null,
      fileUploads: [],
    };
    return [emptyEvaluation];
  }
  return defaultValuesFromDb;
};

export const transformFormEvaluationsToApiEvaluations = (
  evaluations?: EvaluationFormValues[]
): EvaluationApiType[] | undefined => {
  return evaluations
    ?.filter(
      (evaluation) => evaluation.date && evaluation.fileUploads?.[0]?.key
    )
    .map((evaluation) => {
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
