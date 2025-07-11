import Link from "next/link";
import { ReactElement } from "react";

export const Logo = (): ReactElement => {
  return (
    <Link
      className="flex justify-center items-center"
      href="/"
      title="Accueil - Place d’asile"
    >
      <span className="fr-icon-map-pin-user-line text-title-blue-france fr-mr-1w flex justify-center items-center" />
      <h1 className="text-title-blue-france fr-my-1w uppercase leading-4 text-sm">
        Place
        <br />
        d’asile
      </h1>
    </Link>
  );
};
