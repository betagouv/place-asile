import { ControleApiType } from "@/schemas/api/controle.schema";
import { ControleType } from "@/types/controle.type";

export const createControle = ({
  id,
  date,
}: CreateControleArgs): ControleApiType => {
  return {
    id: id ?? 1,
    structureId: 1,
    date: date ?? new Date("01/02/2022").toISOString(),
    type: ControleType.INOPINE,
    fileUploads: [
      {
        id: 1,
        date: new Date("01/02/2022").toISOString(),
        fileSize: 42,
        key: "uuid-1234.pdf",
        category: "INSPECTION_CONTROLE",
        mimeType: "application/pdf",
        originalName: "1234.pdf",
      },
    ],
  };
};

type CreateControleArgs = {
  id?: number;
  date?: string;
};
