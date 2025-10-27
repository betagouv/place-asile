import z from "zod";

export const notesSchema = z.object({
  notes: z.string().nonempty().nullable(),
});

export const notesAutoSaveSchema = notesSchema.partial();

export type NotesFormValues = z.infer<typeof notesSchema>;
export type NotesAutoSaveFormValues = z.infer<typeof notesAutoSaveSchema>;
