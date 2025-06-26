import z from "zod";

export const calendrierSchema = z.object({
  debutPeriodeAutorisation: z.string().optional(),
  finPeriodeAutorisation: z.string().optional(),
  debutConvention: z.string().optional(),
  finConvention: z.string().optional(),
  debutCpom: z.string().optional(),
  finCpom: z.string().optional(),
});
