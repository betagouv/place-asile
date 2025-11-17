import { ContactType } from "@prisma/client";

import { ContactApiType } from "@/schemas/api/contact.schema";
import { PrismaTransaction } from "@/types/prisma.type";

// TODO : check logic behind that since contacts are linked to codeDna not structureId. Thus, the call should be moved out of Structures repository.

const resolveContactCode = (
  contact: Partial<ContactApiType>,
  availableCodes: { code: string; type: string }[]
): string => {
  if (contact.codeDna) {
    const explicitMatch = availableCodes.find(
      (code) => code.code === contact.codeDna
    );
    if (!explicitMatch) {
      throw new Error(
        `Le code DNA ${contact.codeDna} n'est pas associé à la structure`
      );
    }
    return explicitMatch.code;
  }

  const principal = availableCodes.find((code) => code.type === "PRINCIPAL");
  if (principal) {
    return principal.code;
  }

  if (availableCodes[0]) {
    return availableCodes[0].code;
  }

  throw new Error("Aucun code DNA trouvé pour la structure");
};

export const createOrUpdateContacts = async (
  tx: PrismaTransaction,
  contacts: Partial<ContactApiType>[] | undefined,
  structureId: number
): Promise<void> => {
  if (!contacts || contacts.length === 0) {
    return;
  }

  const codesDna = await tx.codeDna.findMany({
    where: { structureId },
    select: { code: true, type: true },
  });

  await Promise.all(
    contacts.map((contact) => {
      const codeDnaCode = resolveContactCode(contact, codesDna);
      const contactType = contact.type ?? ContactType.AUTRE;

      const where = {
        codeDnaCode_type: {
          codeDnaCode,
          type: contactType,
        },
      };

      const baseData = {
        prenom: contact.prenom ?? "",
        nom: contact.nom ?? "",
        telephone: contact.telephone ?? "",
        email: contact.email ?? "",
        role: contact.role ?? "",
        type: contactType,
        structureId,
      };

      return tx.contact.upsert({
        where,
        update: {
          ...baseData,
          codeDnaCode,
        },
        create: {
          ...baseData,
          codeDnaCode,
        },
      });
    })
  );
};
