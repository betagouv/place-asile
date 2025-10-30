import { ControleApiType } from "@/schemas/api/controle.schema";
import { ControleFormValues } from "@/schemas/forms/base/controles.schema";
import { ControleType } from "@/types/controle.type";

export const getControlesDefaultValues = (
  controles: ControleApiType[] = []
): ControleFormValues[] | undefined => {
  const defaultValuesFromDb = controles.map((controle) => {
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

  if (defaultValuesFromDb.length === 0) {
    const emptyControle: ControleFormValues = {
      id: null,
      date: "",
      type: "" as unknown as ControleType,
      fileUploads: [],
    };
    return [...defaultValuesFromDb, emptyControle];
  }

  return defaultValuesFromDb;
};

export const transformFormControlesToApiControles = (
  controles?: ControleFormValues[]
): ControleApiType[] | undefined => {
  return controles
    ?.filter(
      (controle) =>
        controle.date && controle.type && controle.fileUploads?.[0]?.key
    )
    .map((controle) => {
      return {
        id: controle.id || undefined,
        date: controle.date!,
        type: controle.type!,
        fileUploadKey: controle.fileUploads?.[0]?.key,
      };
    });
};
