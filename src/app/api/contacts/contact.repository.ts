import { ContactType } from "@prisma/client";

import { ContactApiType } from "@/schemas/api/contact.schema";
import { PrismaTransaction } from "@/types/prisma.type";

export const createOrUpdateContacts = async (
  tx: PrismaTransaction,
  contacts: Partial<ContactApiType>[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  if (!contacts || contacts.length === 0) {
    return;
  }

  await Promise.all(
    (contacts || []).map((contact) => {
      return tx.contact.upsert({
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
