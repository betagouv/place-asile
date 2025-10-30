import z from "zod";

export const codeDnaApiSchema = z.object({
    id: z.number(),
    dnaCode: z.string(),
    creationDate: z.string().datetime(),
    adresseAdministrative: z.string(),
    codePostalAdministratif: z.string(),
    communeAdministrative: z.string(),
    departementAdministratif: z.string(),
    latitude: z.number(),
    longitude: z.number(),
});

export type CodeDnaApiType = z.infer<typeof codeDnaApiSchema>;