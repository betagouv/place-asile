import Notice from "@codegouvfr/react-dsfr/Notice";

export const NoteDisclaimer = () => {
  return (
    <Notice
      severity="info"
      title=""
      className="rounded [&_p]:flex [&_p]:items-center"
      description="Afin de centraliser toutes les données concernant cette structure, vous pouvez utiliser cette espace pour annoter les informations nécessaires au pilotage : élément contextuel, prochaine échéance, document à produire, point d'attention, élément relationnel avec la structure... Ces éléments ne seront pas communiqués aux structures et ne seront partagés qu'aux agents et agentes en charge. Veuillez préciser votre nom et la date de l’information pour un meilleur suivi."
    />
  );
};
