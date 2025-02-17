import Link from "next/link";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header role="banner" className="border-bottom">
      <div className="space-between">
        <div className="left-menu">
          <Link
            className="align-center"
            href="/"
            title="Accueil - Place d’asile"
          >
            <span
              className={`fr-icon-map-pin-user-line text-blue-france ${styles.icon}`}
            />
            <h1 className="fr-header__service-title text-blue-france fr-my-1w fr-text--sm uppercase">
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
