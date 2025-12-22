import { PLACE_ASILE_CONTACT_EMAIL } from "@/constants";

export const getErrorEmail = (
  error?: string,
  structureDnaCode?: string
): string => {
  const subject = structureDnaCode
    ? `Problème avec le formulaire de Place d'asile (code DNA ${structureDnaCode})`
    : "Problème avec le formulaire de Place d'asile";
  const body = `Bonjour,%0D%0A%0D%0AAjoutez ici des informations supplémentaires...%0D%0A%0D%0ARapport d'erreur: ${error}`;
  return `mailto:${PLACE_ASILE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
};
