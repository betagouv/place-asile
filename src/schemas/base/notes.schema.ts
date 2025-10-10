import z from "zod";

export const notesSchema = z.object({
  notes: z.string().nonempty().nullable(),
});
