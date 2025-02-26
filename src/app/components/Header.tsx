import Link from "next/link";
import styles from "./Header.module.css";
import { ReactElement } from "react";

export const Header = (): ReactElement => {
  return (
    <header role="banner" className="border-bottom">
      <div className="space-between">
        <div className="left-menu fr-py-1w">
          <Link
            className="align-center"
            href="/"
            title="Accueil - Place d’asile"
          >
            <span
              className={`fr-icon-map-pin-user-line text-blue-france fr-mr-1w align-center`}
            />
            <h1
              className={`text-blue-france fr-my-1w uppercase ${styles.title}`}
            >
              Place
              <br />
              d’asile
            </h1>
          </Link>
        </div>
        <button className="fr-btn fr-btn--icon-left fr-btn--tertiary-no-outline fr-icon-question-line">
          Aide
        </button>
      </div>
    </header>
  );
};
