"use client";

import { ReactElement } from "react";

const PROCONNECT_DOMAIN = "fca.integ02.agentconnect.rie.gouv.fr";

export const ProConnect = (): ReactElement => {
  const login = async (): Promise<void> => {
    const auth = await fetch(
      `https://${PROCONNECT_DOMAIN}/api/v2/.well-known/openid-configuration`
    );
    const data = await auth.json();
    console.log(data);
  };

  return (
    <>
      <button type="button" className="fr-connect fr-mt-3w" onClick={login}>
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
    </>
  );
};
