import { ControleApiType } from "@/schemas/api/controle.schema";
import { ControleType } from "@/types/controle.type";

export const getControlesDefaultValues = (
  controles: ControleApiType[] = []
) => {
  return controles.map((controle) => {
    return {
      id: controle.id,
      date: controle.date,
      type: ControleType[controle.type as unknown as keyof typeof ControleType],
      fileUploads: controle.fileUploads,
    };
  });
};
