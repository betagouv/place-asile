import prisma from "@/lib/prisma";
import {
    CpomTypologieApiType,
} from "@/schemas/api/cpom.schema";

export const createOrUpdateCpomTypologies = async (
    typologies: CpomTypologieApiType[] | undefined,
    structureDnaCode: string
): Promise<void> => {
    if (!typologies || typologies.length === 0) {
        return;
    }

    const structure = await prisma.structure.findUnique({
        where: { dnaCode: structureDnaCode },
        select: { id: true },
    });

    if (!structure) {
        throw new Error(
            `Structure avec le code DNA ${structureDnaCode} non trouvée`
        );
    }

    // get cpoms associated to the structure
    const cpomStructures = await prisma.cpomStructure.findMany({
        where: { structureId: structure.id },
        include: {
            cpom: {
                select: {
                    id: true,
                    debutCpom: true,
                    finCpom: true,
                },
            },
        },
    });

    if (cpomStructures.length === 0) {
        console.warn(
            `Aucun CPOM associé à la structure ${structureDnaCode}, typologies ignorées`
        );
        return;
    }

    // for each typology, find corresponding cpom (with two checks: date between debutCpom and finCpom and structure was in the cpom at this date)
    await Promise.all(
        typologies.map(async (typologie) => {
            const typologieDate = new Date(typologie.date);

            const matchingCpom = cpomStructures.find((cpomStructure) => {
                const debutCpom = new Date(cpomStructure.cpom.debutCpom);
                const finCpom = new Date(cpomStructure.cpom.finCpom);

                // check if the typology date is within the cpom period
                if (typologieDate < debutCpom || typologieDate > finCpom) {
                    return false;
                }

                // check if the structure was in the cpom at this date
                const dateDebutStructure = cpomStructure.dateDebut
                    ? new Date(cpomStructure.dateDebut)
                    : debutCpom;
                const dateFinStructure = cpomStructure.dateFin
                    ? new Date(cpomStructure.dateFin)
                    : finCpom;

                return typologieDate >= dateDebutStructure && typologieDate <= dateFinStructure;
            });

            if (!matchingCpom) {
                console.warn(
                    `Aucun CPOM trouvé pour la structure ${structureDnaCode} avec une période couvrant la date ${typologie.date}, typologie ignorée`
                );
                return;
            }

            const cpomId = matchingCpom.cpom.id;

            const typologieData = {
                cumulResultatNet: typologie.cumulResultatNet,
                repriseEtat: typologie.repriseEtat,
                affectationTotal: typologie.affectationTotal,
                affectationReserveInvestissement:
                    typologie.affectationReserveInvestissement,
                affectationChargesNonReproductibles:
                    typologie.affectationChargesNonReproductibles,
                affectationReserveCompensationDeficits:
                    typologie.affectationReserveCompensationDeficits,
                affectationReserveCouvertureBFR:
                    typologie.affectationReserveCouvertureBFR,
                affectationReserveCompensationAmortissements:
                    typologie.affectationReserveCompensationAmortissements,
                affectationFondsDedies: typologie.affectationFondsDedies,
                affectationReportANouveau: typologie.affectationReportANouveau,
                affectationAutre: typologie.affectationAutre,
                commentaire: typologie.commentaire,
            };

            return prisma.cpomTypologie.upsert({
                where: {
                    cpomId_date: {
                        cpomId: cpomId,
                        date: typologieDate,
                    },
                },
                update: typologieData,
                create: {
                    cpomId: cpomId,
                    date: typologieDate,
                    ...typologieData,
                },
            });
        })
    );
};

