import z from "zod";

import { StructureType } from "@/types/structure.type";

export const structureBaseSchema = z.object({
  dnaCode: z.string().min(1),
  type: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.nativeEnum(StructureType)
  ),
  cpom: z.boolean(),
});

export type StructureBaseFormValues = z.infer<typeof structureBaseSchema>;
