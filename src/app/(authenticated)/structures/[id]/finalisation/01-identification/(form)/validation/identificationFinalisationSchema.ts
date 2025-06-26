import z from "zod";

export const IdentificationFinalisationSchema = z.object({});

export type IdentificationFinalisationFormValues = z.infer<
  typeof IdentificationFinalisationSchema
>;
