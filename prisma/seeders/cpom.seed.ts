import { fakerFR as faker } from "@faker-js/faker";

import type { Departement, PrismaClient } from "@/generated/prisma/client";

export const createFakeCpoms = async (
  prisma: PrismaClient,
  maxCpoms: number = 10,
  minStructuresPerCpom: number = 2
): Promise<void> => {
  const currentYear = new Date().getFullYear();

  console.log(`📋 Création de ${maxCpoms} CPOM maximum...`);

  // Constitute potential CPOMs from operators, regions and structures
  const operateurs = await prisma.operateur.findMany({
    include: {
      structures: {
        include: {
          operateur: true,
        },
      },
    },
  });

  const departements = await prisma.departement.findMany();

  const departementToRegion = new Map<string, string>(
    departements.map((departement: Departement) => [
      departement.numero,
      departement.region,
    ])
  );

  const structuresByOperateurAndRegion = new Map<string, number[]>();

  for (const operateur of operateurs) {
    for (const structure of operateur.structures) {
      const region = departementToRegion.get(
        structure.departementAdministratif
      );
      if (!region) {
        continue;
      }
      const key = `${operateur.id}-${region}`;
      const existingStructures = structuresByOperateurAndRegion.get(key) || [];
      structuresByOperateurAndRegion.set(key, [
        ...existingStructures,
        structure.id,
      ]);
    }
  }

  // Filter groups with at least n structures and randomize selection
  const validGroups = faker.helpers
    .shuffle(
      Array.from(structuresByOperateurAndRegion.entries()).filter(
        ([, structures]) => structures.length >= minStructuresPerCpom
      )
    )
    .slice(0, maxCpoms);

  if (validGroups.length === 0) {
    console.log(
      `⚠️ Aucun groupe (opérateur + région) avec au moins ${minStructuresPerCpom} structures trouvé`
    );
    return;
  }

  // Create CPOMs for valid groups
  for (const [key, structures] of validGroups) {
    const [operateurIdStr, region] = key.split("-");

    const dureeAnnees = faker.number.int({ min: 3, max: 5 });
    const anneeDebut = faker.number.int({
      min: currentYear - dureeAnnees,
      max: currentYear,
    });
    const debutCpom = new Date(anneeDebut, 0, 1, 13);
    const finCpom = new Date(anneeDebut + dureeAnnees, 0, 1, 13);

    const cpomName = `CPOM ${operateurIdStr} ${region} ${anneeDebut}-${anneeDebut + dureeAnnees}`;

    // Select between 60% and 100% of structures for this CPOM
    const nbStructures = Math.max(
      minStructuresPerCpom,
      Math.floor(structures.length * faker.number.float({ min: 0.6, max: 1.0 }))
    );
    const selectedStructures = faker.helpers.arrayElements(
      structures,
      nbStructures
    );

    // Create the CPOM
    const cpom = await prisma.cpom.create({
      data: {
        name: cpomName,
        debutCpom,
        finCpom,
        structures: {
          create: selectedStructures.map((structureId) => {
            // 10% chance that a structure joins or leaves the CPOM in the middle
            const joinLater = faker.datatype.boolean({ probability: 0.1 });
            const leaveEarly = faker.datatype.boolean({ probability: 0.1 });

            let dateDebut: Date | null = null;
            let dateFin: Date | null = null;

            if (joinLater) {
              const joinMin = Math.min(anneeDebut + 1, currentYear);
              const joinMax = Math.min(
                anneeDebut + dureeAnnees - 1,
                currentYear
              );
              if (joinMin <= joinMax) {
                const anneeRejointe = faker.number.int({
                  min: joinMin,
                  max: joinMax,
                });
                dateDebut = new Date(anneeRejointe, 0, 1, 13);
              }
            }

            if (leaveEarly && !joinLater) {
              const leaveMax = Math.min(
                anneeDebut + dureeAnnees - 1,
                currentYear - 1
              );
              const leaveMin = Math.min(
                Math.max(anneeDebut + 1, anneeDebut),
                leaveMax
              );
              if (leaveMin <= leaveMax) {
                const anneeQuitte = faker.number.int({
                  min: leaveMin,
                  max: leaveMax,
                });
                dateFin = new Date(anneeQuitte + 1, 0, 1, 13);
              }
            }

            return {
              structureId: structureId,
              dateDebut,
              dateFin,
            };
          }),
        },
      },
    });

    console.log(
      `✅ CPOM créé : ${cpomName} avec ${selectedStructures.length} structures`
    );

    // Create millesimes for each year of the CPOM
    const annees = [...Array(dureeAnnees)].map(
      (_, index) => anneeDebut + index
    );

    for (const annee of annees) {
      const millesimeDate = new Date(annee, 0, 1, 13);

      await prisma.cpomMillesime.create({
        data: {
          cpomId: cpom.id,
          date: millesimeDate,
          cumulResultatNet: faker.number.float({
            min: -100000,
            max: 500000,
            fractionDigits: 2,
          }),
          repriseEtat: faker.number.float({
            min: 0,
            max: 50000,
            fractionDigits: 2,
          }),
          affectationTotal: faker.number.float({
            min: 0,
            max: 1000000,
            fractionDigits: 2,
          }),
          affectationReserveInvestissement: faker.number.float({
            min: 0,
            max: 200000,
            fractionDigits: 2,
          }),
          affectationChargesNonReproductibles: faker.number.float({
            min: 0,
            max: 100000,
            fractionDigits: 2,
          }),
          affectationReserveCompensationDeficits: faker.number.float({
            min: 0,
            max: 150000,
            fractionDigits: 2,
          }),
          affectationReserveCouvertureBFR: faker.number.float({
            min: 0,
            max: 100000,
            fractionDigits: 2,
          }),
          affectationReserveCompensationAmortissements: faker.number.float({
            min: 0,
            max: 200000,
            fractionDigits: 2,
          }),
          affectationFondsDedies: faker.number.float({
            min: 0,
            max: 300000,
            fractionDigits: 2,
          }),
          affectationReportANouveau: faker.number.float({
            min: 0,
            max: 50000,
            fractionDigits: 2,
          }),
          affectationAutre: faker.number.float({
            min: 0,
            max: 100000,
            fractionDigits: 2,
          }),
          commentaire: faker.datatype.boolean({ probability: 0.3 })
            ? faker.lorem.sentence()
            : null,
        },
      });
    }
  }

  console.log("✅ CPOMs créés avec succès");
};
