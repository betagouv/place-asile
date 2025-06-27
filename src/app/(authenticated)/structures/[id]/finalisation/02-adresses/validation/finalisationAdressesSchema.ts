import z from "zod";

export type AdressesFormValues = z.infer<typeof finalisationAdressesSchema>;
export const finalisationAdressesSchema = z.object({
  nom: z.string().optional(),
  adresseAdministrativeComplete: z.string().nonempty(),
  adresseAdministrative: z.string().nonempty(),
  codePostalAdministratif: z.string().nonempty(),
  communeAdministrative: z.string().nonempty(),
  departementAdministratif: z.string().nonempty(),
});
