import { Metadata } from "next";
import Link from "next/link";
import { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Page non trouvée",
};

export default function NotFound(): ReactElement {
  return (
    <main role="main" id="content">
      <div className="fr-container">
        <div className="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
          <div className="fr-py-0 fr-col-12 fr-col-md-6">
            <h1>Page non trouvée</h1>
            <p className="fr-text--sm fr-mb-3w">Erreur 404</p>
            <p className="fr-text--lead fr-mb-3w">
              La page que vous cherchez est introuvable. Excusez-nous pour la
              gène occasionnée.
            </p>
            <p className="fr-text--sm fr-mb-5w">
              Si vous avez tapé l’adresse web dans le navigateur, vérifiez
              qu’elle est correcte. La page n’est peut-être plus disponible.
              <br />
              Dans ce cas, pour continuer votre visite vous pouvez consulter
              notre page d’accueil, ou effectuer une recherche avec notre moteur
              de recherche en haut de page.
              <br />
              Sinon contactez-nous pour que l’on puisse vous rediriger vers la
              bonne information.
            </p>
            <Link className="fr-btn" href="/">
              Page d’accueil
            </Link>
          </div>
          <div className="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0 fr-py-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fr-responsive-img fr-artwork"
              aria-hidden="true"
              width="160"
              height="200"
              viewBox="0 0 160 200"
            >
              <use
                className="fr-artwork-motif"
                href="ovoid.svg#artwork-motif"
              ></use>
              <use
                className="fr-artwork-background"
                href="ovoid.svg#artwork-background"
              ></use>
              <g transform="translate(40, 60)">
                <use
                  className="fr-artwork-decorative"
                  href="technical-error.svg#artwork-decorative"
                ></use>
                <use
                  className="fr-artwork-minor"
                  href="technical-error.svg#artwork-minor"
                ></use>
                <use
                  className="fr-artwork-major"
                  href="technical-error.svg#artwork-major"
                ></use>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
}
