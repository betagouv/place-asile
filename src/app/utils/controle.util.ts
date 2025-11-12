import { v4 as uuidv4 } from "uuid";

import { ControleApiType } from "@/schemas/api/controle.schema";
import { ControleFormValues } from "@/schemas/forms/base/controle.schema";
import { ControleType } from "@/types/controle.type";

export const getControlesDefaultValues = (
  controles: ControleApiType[] = []
): ControleFormValues[] | undefined => {
  const defaultValuesFromDb = controles.map((controle) => {
    return {
      id: controle.id ?? undefined,
      date: controle.date ?? "",
      type: ControleType[controle.type as unknown as keyof typeof ControleType],
      fileUploads: controle.fileUploads?.map((fileUpload) => ({
        key: fileUpload.key,
        id: fileUpload.id ?? undefined,
      })),
    };
  });

  if (defaultValuesFromDb.length === 0) {
    const emptyControle = {
      date: "",
      type: undefined,
      fileUploads: [],
      uuid: uuidv4(),
    };
    return [emptyControle];
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
