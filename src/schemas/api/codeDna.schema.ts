import z from "zod";

import { CodeDnaType } from "@/types/codeDna.type";

export const codeDnaApiSchema = z.object({
    id: z.number().optional(),
    code: z.string(),
    structureId: z.number().optional(),
    creationDate: z.string().datetime().optional(),
    type: z.nativeEnum(CodeDnaType).optional(),
    adresseAdministrative: z.string().optional(),
    codePostalAdministratif: z.string().optional(),
    communeAdministrative: z.string().optional(),
    departementAdministratif: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});

export type CodeDnaApiType = z.infer<typeof codeDnaApiSchema>;