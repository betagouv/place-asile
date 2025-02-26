import Link from "next/link";
import { ReactElement } from "react";
import styles from "./Logo.module.css";

export const Logo = (): ReactElement => {
  return (
    <Link className="align-center" href="/" title="Accueil - Place d’asile">
      <span className="fr-icon-map-pin-user-line text-blue-france fr-mr-1w align-center" />
      <h1 className={`text-blue-france fr-my-1w uppercase ${styles.title}`}>
        Place
        <br />
        d’asile
      </h1>
    </Link>
  );
};
