import Link from "next/link";
import { ReactElement } from "react";

export const DemarchesSimplifieesInfo = (): ReactElement => {
  return (
    <span className="text-sm m-3">
      Pour connaître le détail d’un EIG, consultez le sur{" "}
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
