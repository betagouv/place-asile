import z from "zod";

export const cpomTypologieApiSchema = z.object({
    id: z.number().optional(),
    date: z.string().datetime(),
    cumulResultatNet: z.number().nullish(),
    repriseEtat: z.number().nullish(),
    affectationTotal: z.number().nullish(),
    affectationReserveInvestissement: z.number().nullish(),
    affectationChargesNonReproductibles: z.number().nullish(),
    affectationReserveCompensationDeficits: z.number().nullish(),
    affectationReserveCouvertureBFR: z.number().nullish(),
    affectationReserveCompensationAmortissements: z.number().nullish(),
    affectationFondsDedies: z.number().nullish(),
    affectationReportANouveau: z.number().nullish(),
    affectationAutre: z.number().nullish(),
    commentaire: z.string().nullish(),
});

export type CpomTypologieApiType = z.infer<typeof cpomTypologieApiSchema>;

export const cpomApiSchema = z.object({
    id: z.number().optional(),
    name: z.string().nullish(),
    debutCpom: z.string().datetime(),
    finCpom: z.string().datetime(),
    structureIds: z.array(z.number()).optional(),
    typologies: z.array(cpomTypologieApiSchema).optional(),
});

export type CpomApiType = z.infer<typeof cpomApiSchema>;
