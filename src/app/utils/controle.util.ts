import { ControleApiType } from "@/schemas/api/controle.schema";
import { ControleFormValues } from "@/schemas/forms/base/controles.schema";
import { ControleType } from "@/types/controle.type";

export const getControlesDefaultValues = (
  controles: ControleApiType[] = []
): ControleFormValues[] | undefined => {
  return controles.map((controle) => {
    return {
      id: controle.id ?? null,
      date: controle.date ?? "",
      type: ControleType[controle.type as unknown as keyof typeof ControleType],
      fileUploads: controle.fileUploads?.map((fileUpload) => ({
        key: fileUpload.key,
        id: fileUpload.id ?? null,
      })),
    };
  });
};
