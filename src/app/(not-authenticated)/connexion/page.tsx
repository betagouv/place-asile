import { ReactElement } from "react";
import { ProConnect } from "./ProConnect";
import styles from "./page.module.css";

export default function Login(): ReactElement {
  return (
    <div className={styles["main-block"]}>
      <h2 className="fr-h4">Connexion à Place d’asile</h2>
      <p className="fr-text--lg">
        <strong>
          Agent·es de département, de région ou de la Direction de l’Asile ?
          Connectez-vous à Place d’Asile pour piloter les structures et
          opérateurs de votre parc d’hébergement.
        </strong>
      </p>
      <p className="fr-text--sm">
        ProConnect est la solution proposée par l’État pour sécuriser et
        simplifier la connexion aux services en ligne en tant que professionnel.
      </p>
      <ProConnect />
    </div>
  );
}
