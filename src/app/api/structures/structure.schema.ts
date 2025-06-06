import { Repartition } from "@/types/adresse.type";
import { FileUploadCategory } from "@/types/file-upload.type";
import { PublicType, StructureType } from "@/types/structure.type";
import { z } from "zod";

const adresseTypologieSchema = z.object({
  nbPlacesTotal: z
    .number()
    .int()
    .positive()
    .min(1, "Le nombre de places total est requis"),
  date: z.coerce.date({
    message: "La date de la typologie d'adresse est requise",
  }),
  qpv: z.number().int(), // TODO : Gérer la validation de la valeur 0
  logementSocial: z.number().int(),
});

const adresseSchema = z.object({
  adresse: z.string().min(1, "L'adresse du logement est requise"),
  codePostal: z.string().min(1, "Le code postal du logement est requis"),
  commune: z.string().min(1, "Le code postal du logement est requis"),
  repartition: z.nativeEnum(Repartition),
  typologies: z.array(adresseTypologieSchema),
});

const contactSchema = z.object({
  prenom: z.string().min(1, "Le prénom du contact est requis"),
  nom: z.string().min(1, "Le nom du contact est requis"),
  telephone: z.string().min(1, "Le numéro de téléphone du contact est requis"),
  email: z.string().email().min(1, "L'email du contact est requis"),
  role: z.string().min(1, "Le rôle du contact est requis"),
});

const structureTypologieSchema = z.object({
  date: z.coerce.date({ message: "La date de la typologie est requise" }),
  pmr: z.number().int(),
  lgbt: z.number().int(),
  fvvTeh: z.number().int(),
});

const fileUploadSchema = z.object({
  key: z.string().min(1, "La clé d'upload du fichier est requise"),
  date: z.coerce.date(),
  category: z.nativeEnum(FileUploadCategory, {
    invalid_type_error:
      "La catégorie du document doit être de type : " +
      Object.values(PublicType).join(", "),
  }),
});

export const structureCreationSchema = z.object({
  dnaCode: z.string().min(1, "Le code DNA est requis"),
  operateur: z.string().min(1, "L'opérateur est requis"),
  filiale: z.string().optional(),
  type: z.nativeEnum(StructureType),
  nbPlaces: z
    .number()
    .int()
    .positive()
    .min(1, "Le nombre de places autorisées est requis"),
  adresseAdministrative: z
    .string()
    .min(1, "L'adresse administrative est requise"),
  codePostalAdministratif: z
    .string()
    .min(1, "Le code postal administratif est requis"),
  communeAdministrative: z
    .string()
    .min(1, "La commune de l'adresse administrative est requise"),
  departementAdministratif: z
    .string()
    .min(1, "Le département de l'adresse administrative est requis"),
  nom: z.string().optional(),
  debutConvention: z.coerce.date().optional(),
  finConvention: z.coerce.date().optional(),
  cpom: z.boolean({
    required_error: "Le CPOM est requis",
  }),
  creationDate: z.coerce.date({ message: "La date de création est requise" }),
  finessCode: z.string().optional(),
  lgbt: z.boolean({
    required_error: "L'accueil de LGBT dans la structure est requis",
  }),
  fvvTeh: z.boolean({
    required_error: "L'accueil de FVV-TEH dans la structure est requis",
  }),
  public: z.nativeEnum(PublicType),
  debutPeriodeAutorisation: z.coerce.date().optional(),
  finPeriodeAutorisation: z.coerce.date().optional(),
  debutCpom: z.coerce.date().optional(),
  finCpom: z.coerce.date().optional(),
  adresses: z.array(adresseSchema),
  contacts: z.array(contactSchema),
  typologies: z.array(structureTypologieSchema),
  fileUploads: z.array(fileUploadSchema),
});
