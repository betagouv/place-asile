import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import z from "zod";
import { PublicType, StructureType } from "@/types/structure.type";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import { contactSchema } from "@/app/(password-protected)/ajout-structure/validation/contactSchema";

export const finalisationIdentificationSchema = z
  .object({
    dnaCode: z.string().nonempty(),
    operateur: z.string().nonempty(),
    type: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.nativeEnum(StructureType, {
        invalid_type_error: "Le type doit être un type de structure valide",
      })
    ),
    creationDate: createDateFieldValidator(),
    finessCode: z.string().optional().or(z.literal("")),
    public: z.nativeEnum(PublicType, {
      invalid_type_error:
        "Le public doit être de type : " + Object.values(PublicType).join(", "),
    }),
    filiale: z.string().optional(),
    cpom: z.boolean(),
    lgbt: z.boolean(),
    fvvTeh: z.boolean(),
    contacts: z.array(z.union([contactSchema, contactSchema.optional()])),
    debutPeriodeAutorisation: createDateFieldValidator().optional(),
    finPeriodeAutorisation: createDateFieldValidator().optional(),
    debutConvention: createDateFieldValidator().optional(),
    finConvention: createDateFieldValidator().optional(),
    debutCpom: createDateFieldValidator().optional(),
    finCpom: createDateFieldValidator().optional(),
  })
  .refine(
    (data) => {
      return !data.cpom || data.debutCpom;
    },
    {
      message: "La date de début CPOM est obligatoire",
      path: ["debutCpom"],
    }
  )
  .refine(
    (data) => {
      return !data.cpom || data.finCpom;
    },
    {
      message: "La date de fin CPOM est obligatoire",
      path: ["finCpom"],
    }
  )
  .refine(
    (data) => {
      if (
        isStructureAutorisee(data.type) &&
        (!data.debutPeriodeAutorisation || data.debutPeriodeAutorisation === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "La date de début est obligatoire pour les structures autorisées",
      path: ["debutPeriodeAutorisation"],
    }
  )
  .refine(
    (data) => {
      if (
        isStructureAutorisee(data.type) &&
        (!data.finPeriodeAutorisation || data.finPeriodeAutorisation === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "La date de fin est obligatoire pour les structures autorisées",
      path: ["finPeriodeAutorisation"],
    }
  )
  .refine(
    (data) => {
      if (
        isStructureSubventionnee(data.type) &&
        (!data.debutConvention || data.debutConvention === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "La date de début est obligatoire pour les structures subventionnées",
      path: ["debutConvention"],
    }
  )
  .refine(
    (data) => {
      if (
        isStructureSubventionnee(data.type) &&
        (!data.finConvention || data.finConvention === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "La date de fin est obligatoire pour les structures subventionnées",
      path: ["finConvention"],
    }
  )
  .refine(
    (data) => {
      if (
        isStructureAutorisee(data.type) &&
        (!data.finessCode || data.finessCode === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Le code FINESS est obligatoire pour les structures autorisées",
      path: ["finessCode"],
    }
  );

export type FinalisationIdentificationFormValues = z.infer<
  typeof finalisationIdentificationSchema
>;

// {
//   "id": 131,
//   "dnaCode": "C1402",
//   "operateur": "FTDA",
//   "filiale": "YSOS",
//   "type": "CADA",
//   "nbPlaces": 103,
//   "placesACreer": 0,
//   "placesAFermer": 0,
//   "echeancePlacesACreer": "2027-01-31T23:00:00.000Z",
//   "echeancePlacesAFermer": "2026-01-31T23:00:00.000Z",
//   "adresseAdministrative": "320 boulevard du Val Saint Clair",
//   "codePostalAdministratif": "14200",
//   "communeAdministrative": "Herouville-Saint-Clair",
//   "departementAdministratif": "Calvados",
//   "latitude": "49.206336",
//   "longitude": "-0.325282",
//   "nom": null,
//   "debutConvention": "2023-11-26T23:00:00.000Z",
//   "finConvention": "2024-12-30T23:00:00.000Z",
//   "cpom": true,
//   "creationDate": "2006-04-26T22:00:00.000Z",
//   "finessCode": "750806540",
//   "lgbt": false,
//   "fvvTeh": false,
//   "public": "FAMILLE",
//   "debutPeriodeAutorisation": "2024-03-14T23:00:00.000Z",
//   "finPeriodeAutorisation": "2039-03-14T23:00:00.000Z",
//   "debutCpom": "2022-01-31T23:00:00.000Z",
//   "finCpom": "2027-01-31T23:00:00.000Z",
//   "notes": "Notes de la structure C1402",
//   "adresses": [
//       {
//           "id": 1,
//           "structureDnaCode": "C1402",
//           "adresse": "24 rue Saint-Paul",
//           "codePostal": "14200",
//           "commune": "Herouville-Saint-Clair ",
//           "repartition": "DIFFUS",
//           "adresseTypologies": [
//               {
//                   "id": 1318,
//                   "adresseId": 1,
//                   "nbPlacesTotal": 26,
//                   "date": "2023-12-31T23:00:00.000Z",
//                   "qpv": 7,
//                   "logementSocial": 1
//               },
//               {
//                   "id": 1317,
//                   "adresseId": 1,
//                   "nbPlacesTotal": 26,
//                   "date": "2022-12-31T23:00:00.000Z",
//                   "qpv": 5,
//                   "logementSocial": 1
//               },
//               {
//                   "id": 1316,
//                   "adresseId": 1,
//                   "nbPlacesTotal": 22,
//                   "date": "2021-12-31T23:00:00.000Z",
//                   "qpv": 5,
//                   "logementSocial": 1
//               },
//               {
//                   "id": 1315,
//                   "adresseId": 1,
//                   "nbPlacesTotal": 21,
//                   "date": "2020-12-31T23:00:00.000Z",
//                   "qpv": 5,
//                   "logementSocial": 0
//               }
//           ]
//       },
//       {
//           "id": 2,
//           "structureDnaCode": "C1402",
//           "adresse": "20 rue Saint-Paul",
//           "codePostal": "14200",
//           "commune": "Herouville-Saint-Clair ",
//           "repartition": "DIFFUS",
//           "adresseTypologies": []
//       },
//       {
//           "id": 3,
//           "structureDnaCode": "C1402",
//           "adresse": "22 rue Saint-Paul",
//           "codePostal": "14200",
//           "commune": "Herouville-Saint-Clair ",
//           "repartition": "DIFFUS",
//           "adresseTypologies": []
//       },
//       {
//           "id": 4,
//           "structureDnaCode": "C1402",
//           "adresse": "12 rue Saint-Paul",
//           "codePostal": "14200",
//           "commune": "Herouville-Saint-Clair ",
//           "repartition": "DIFFUS",
//           "adresseTypologies": []
//       },
//       {
//           "id": 5,
//           "structureDnaCode": "C1402",
//           "adresse": "16 rue Saint-Paul",
//           "codePostal": "14200",
//           "commune": "Herouville-Saint-Clair ",
//           "repartition": "DIFFUS",
//           "adresseTypologies": []
//       },
//       {
//           "id": 6,
//           "structureDnaCode": "C1402",
//           "adresse": "14 rue Saint-Paul",
//           "codePostal": "14200",
//           "commune": "Herouville-Saint-Clair ",
//           "repartition": "DIFFUS",
//           "adresseTypologies": []
//       },
//       {
//           "id": 7,
//           "structureDnaCode": "C1402",
//           "adresse": "18 rue Saint-Paul",
//           "codePostal": "14200",
//           "commune": "Herouville-Saint-Clair ",
//           "repartition": "DIFFUS",
//           "adresseTypologies": []
//       }
//   ],
//   "contacts": [
//       {
//           "id": 119,
//           "structureDnaCode": "C1402",
//           "prenom": "Isabelle",
//           "nom": "COUSIN",
//           "telephone": "02 31 54 54 46",
//           "email": "icousin@france-terre-asile.org",
//           "role": "Directeur"
//       }
//   ],
//   "structureTypologies": [
//       {
//           "id": 199,
//           "structureDnaCode": "C1402",
//           "date": "2024-12-31T23:00:00.000Z",
//           "pmr": 8,
//           "lgbt": 2,
//           "fvvTeh": 0
//       },
//       {
//           "id": 200,
//           "structureDnaCode": "C1402",
//           "date": "2023-12-31T23:00:00.000Z",
//           "pmr": 7,
//           "lgbt": 1,
//           "fvvTeh": 0
//       },
//       {
//           "id": 201,
//           "structureDnaCode": "C1402",
//           "date": "2023-03-02T23:00:00.000Z",
//           "pmr": 4,
//           "lgbt": 2,
//           "fvvTeh": 4
//       }
//   ],
//   "evaluations": [
//       {
//           "id": 3,
//           "structureDnaCode": "C1402",
//           "date": "2025-04-11T22:00:00.000Z",
//           "notePersonne": 3,
//           "notePro": 4,
//           "noteStructure": 5,
//           "note": 4
//       },
//       {
//           "id": 2,
//           "structureDnaCode": "C1402",
//           "date": "2024-04-11T22:00:00.000Z",
//           "notePersonne": 1,
//           "notePro": 3,
//           "noteStructure": 2,
//           "note": 2
//       },
//       {
//           "id": 1,
//           "structureDnaCode": "C1402",
//           "date": "2023-04-11T22:00:00.000Z",
//           "notePersonne": 5,
//           "notePro": 3,
//           "noteStructure": 4,
//           "note": 4
//       }
//   ],
//   "controles": [
//       {
//           "id": 3,
//           "structureDnaCode": "C1402",
//           "date": "2025-04-11T22:00:00.000Z",
//           "type": "PROGRAMME"
//       },
//       {
//           "id": 2,
//           "structureDnaCode": "C1402",
//           "date": "2024-04-11T22:00:00.000Z",
//           "type": "INOPINE"
//       },
//       {
//           "id": 1,
//           "structureDnaCode": "C1402",
//           "date": "2023-04-11T22:00:00.000Z",
//           "type": "INOPINE"
//       }
//   ],
//   "activites": [],
//   "evenementsIndesirablesGraves": [
//       {
//           "id": 1,
//           "structureDnaCode": "C1402",
//           "numeroDossier": "22689608",
//           "evenementDate": "2023-06-06T22:00:00.000Z",
//           "declarationDate": "2023-06-07T22:00:00.000Z",
//           "type": "Sinistre et évènement exceptionnel "
//       },
//       {
//           "id": 2,
//           "structureDnaCode": "C1402",
//           "numeroDossier": "22689609",
//           "evenementDate": "2023-06-07T22:00:00.000Z",
//           "declarationDate": "2023-06-08T22:00:00.000Z",
//           "type": "Défaillance équipement technique de la structure "
//       },
//       {
//           "id": 3,
//           "structureDnaCode": "C1402",
//           "numeroDossier": "22689610",
//           "evenementDate": "2023-06-08T22:00:00.000Z",
//           "declarationDate": "2023-06-09T22:00:00.000Z",
//           "type": "Perturbation RH - Organisation du travail "
//       }
//   ],
//   "fileUploads": [],
//   "budgets": [],
//   "coordinates": [
//       49.206336,
//       -0.325282
//   ]
// }
