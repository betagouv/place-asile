import prisma from "@/lib/prisma";
import { EvaluationApiType } from "@/schemas/api/evaluation.schema";

const deleteEvaluations = async (
  evaluationsToKeep: EvaluationApiType[],
  structureDnaCode: string
): Promise<void> => {
  const allEvaluations = await prisma.evaluation.findMany({
    where: { structureDnaCode: structureDnaCode },
  });
  const evaluationsToDelete = allEvaluations.filter(
    (evaluation) =>
      !evaluationsToKeep.some(
        (evaluationToKeep) => evaluationToKeep.id === evaluation.id
      )
  );
  await Promise.all(
    evaluationsToDelete.map((evaluation) =>
      prisma.evaluation.delete({ where: { id: evaluation.id } })
    )
  );
};

export const createOrUpdateEvaluations = async (
  evaluations: EvaluationApiType[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  if (!evaluations || evaluations.length === 0) {
    return;
  }

  deleteEvaluations(evaluations, structureDnaCode);

  await Promise.all(
    (evaluations || []).map((evaluation) => {
      return prisma.evaluation.upsert({
        where: { id: evaluation.id || 0 },
        update: {
          date: evaluation.date,
          notePersonne: evaluation.notePersonne,
          notePro: evaluation.notePro,
          noteStructure: evaluation.noteStructure,
          note: evaluation.note,
          fileUploads: {
            connect: evaluation.fileUploads,
          },
        },
        create: {
          structureDnaCode,
          date: evaluation.date ?? "",
          notePersonne: evaluation.notePersonne,
          notePro: evaluation.notePro,
          noteStructure: evaluation.noteStructure,
          note: evaluation.note,
          fileUploads: {
            connect: evaluation.fileUploads,
          },
        },
      });
    })
  );
};
