import z from "zod";

export type NotesFormValues = z.infer<typeof finalisationNotesSchema>;
export const finalisationNotesSchema = z.object({
  notes: z.string().nonempty().nullable(),
});
