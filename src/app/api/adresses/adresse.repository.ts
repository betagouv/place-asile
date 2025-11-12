import prisma from "@/lib/prisma";
import { AdresseApiType } from "@/schemas/api/adresse.schema";

import { convertToRepartition } from "../structures/structure.util";

const getEveryAdresseTypologiesOfAdresses = async (
  adresses: Partial<AdresseApiType>[]
): Promise<Awaited<ReturnType<typeof prisma.adresseTypologie.findMany>>> => {
  const existingAdresseIds = adresses
    .filter((adresse) => adresse.id)
    .map((adresse) => adresse.id as number);

  let allTypologies: Awaited<
    ReturnType<typeof prisma.adresseTypologie.findMany>
  > = [];
  if (existingAdresseIds.length > 0) {
    allTypologies = await prisma.adresseTypologie.findMany({
      where: { adresseId: { in: existingAdresseIds } },
    });
  }
  return allTypologies;
};

const deleteAdresses = async (
  adressesToKeep: Partial<AdresseApiType>[],
  structureDnaCode: string
): Promise<void> => {
  const everyAdressesOfStructure = await prisma.adresse.findMany({
    where: { structureDnaCode: structureDnaCode },
  });
  const adressesToDelete = everyAdressesOfStructure.filter(
    (adresse) => !adressesToKeep.some((a) => a.id === adresse.id)
  );
  await Promise.all(
    adressesToDelete.map((adresse) =>
      prisma.adresse.delete({ where: { id: adresse.id } })
    )
  );
};

export const createOrUpdateAdresses = async (
  adresses: Partial<AdresseApiType>[] = [],
  structureDnaCode: string
): Promise<void> => {
  if (!adresses || adresses.length === 0) {
    return;
  }

  // Delete adresses that are not in the provided array
  await deleteAdresses(adresses, structureDnaCode);

  // Fetch all typologies for existing addresses
  const allTypologies = await getEveryAdresseTypologiesOfAdresses(adresses);

  for (const adresse of adresses) {
    if (adresse.id) {
      // Update existing address
      await prisma.adresse.update({
        where: { id: adresse.id },
        data: {
          adresse: adresse.adresse,
          codePostal: adresse.codePostal,
          commune: adresse.commune,
          repartition: convertToRepartition(adresse.repartition),
        },
      });

      // Delete typologies not in the array
      const existingTypologies = allTypologies.filter(
        (typologie) => typologie.adresseId === adresse.id
      );
      const typologiesToDelete = existingTypologies.filter(
        (existing) =>
          !adresse.adresseTypologies?.some((t) => t.id === existing.id)
      );
      if (typologiesToDelete.length > 0) {
        await prisma.adresseTypologie.deleteMany({
          where: { id: { in: typologiesToDelete.map((t) => t.id) } },
        });
      }

      // Update or create typologies
      for (const typologie of adresse.adresseTypologies || []) {
        // Update existing typologie
        await prisma.adresseTypologie.upsert({
          where: { id: typologie.id || 0 },
          update: typologie,
          create: {
            adresseId: adresse.id,
            placesAutorisees: typologie.placesAutorisees,
            date: typologie.date,
            qpv: typologie.qpv,
            logementSocial: typologie.logementSocial,
          },
        });
      }
    }
  }
};
