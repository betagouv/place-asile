import { Logo } from "@/app/components/Logo";
import { ReactElement } from "react";

export default function Login(): ReactElement {
  return (
    <div className="fr-connect-group fr-mt-3w">
      <Logo />
      <button type="button" className="fr-connect fr-mt-3w">
        <span className="fr-connect__login">S’identifier avec</span>
        <span className="fr-connect__brand">ProConnect</span>
      </button>
      <p>
        <a
          href="https://www.proconnect.gouv.fr/"
          target="_blank"
          rel="noopener"
          title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
        >
          Qu’est-ce que ProConnect ?
        </a>
      </p>
    </div>
  );
}
