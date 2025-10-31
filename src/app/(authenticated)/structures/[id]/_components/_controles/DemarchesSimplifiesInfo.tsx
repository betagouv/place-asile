import Link from "next/link";
import { ReactElement } from "react";

export const DemarchesSimplifieesInfo = (): ReactElement => {
  return (
    <span className="text-sm m-3">
      Actuellement, seuls les EIG renseignés sur Démarches Simplifiées sont
      affichés, l’ancienneté de cet historique dépend donc de la date à laquelle
      votre région a été articulée avec l’outil. Pour connaître le détail d’un
      EIG, consultez le sur{" "}
      <Link
        href="https://www.demarches-simplifiees.fr/"
        target="_blank"
        rel="noopener external"
        title="Démarches simplifiées"
      >
        <span className="underline">Démarches simplifiées</span>
      </Link>{" "}
      avec le numéro de dossier correspondant.
    </span>
  );
};
