import { ContactType } from "@prisma/client";

import prisma from "@/lib/prisma";
import { ContactApiType } from "@/schemas/api/contact.schema";

export const createOrUpdateContacts = async (
  contacts: Partial<ContactApiType>[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  await Promise.all(
    (contacts || []).map((contact) => {
      return prisma.contact.upsert({
        where: {
          structureDnaCode_type: {
            structureDnaCode: structureDnaCode,
            type: contact.type ?? ContactType.AUTRE,
          },
        },
        update: {
          prenom: contact.prenom ?? "",
          nom: contact.nom ?? "",
          telephone: contact.telephone ?? "",
          email: contact.email ?? "",
          role: contact.role ?? "",
          type: contact.type ?? ContactType.AUTRE,
        },
        create: {
          structureDnaCode,
          prenom: contact.prenom ?? "",
          nom: contact.nom ?? "",
          telephone: contact.telephone ?? "",
          email: contact.email ?? "",
          role: contact.role ?? "",
          type: contact.type ?? ContactType.AUTRE,
        },
      });
    })
  );
};
