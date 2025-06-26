import { PublicType, StructureType } from "@/types/structure.type";
import z from "zod";

export const descriptionSchema = z.object({
  dnaCode: z.string().nonempty(),
  operateur: z.string().nonempty(),
  type: z.nativeEnum(StructureType, {
    invalid_type_error: "Le type doit être un type de structure valide",
  }),
  creationDate: z.string(),
  finessCode: z.string().optional().or(z.literal("")),
  public: z.nativeEnum(PublicType, {
    invalid_type_error:
      "Le public doit être de type : " + Object.values(PublicType).join(", "),
  }),
  filiale: z.string().optional(),
  cpom: z.boolean(),
  lgbt: z.boolean(),
  fvvTeh: z.boolean(),
});

export const defaultType = StructureType.CADA;

export type DescriptionFormValues = z.infer<typeof descriptionSchema>;
