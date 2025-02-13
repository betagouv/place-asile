import Link from "next/link";

export const Header = () => {
  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    République
                    <br />
                    française
                  </p>
                </div>
              </div>
              <div className="fr-header__service">
                <Link href="/" title="Accueil - Place d’asile">
                  <h1 className="fr-header__service-title">Place d’asile</h1>
                </Link>
                <p className="fr-header__service-tagline">
                  Piloter le parc de logements pour demandeurs d’asile
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
