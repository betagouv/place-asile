"use client";

import { ReactElement } from "react";
import { signIn } from "next-auth/react";
import { ProConnectButton } from "@codegouvfr/react-dsfr/ProConnectButton";

export default function Login(): ReactElement {
  const login = async (): Promise<void> => {
    signIn("proconnect", {
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}/structures`,
    });
  };

  return (
    <div className="bg-alt-grey max-w-[600px] m-16 px-24 py-12">
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
      <ProConnectButton onClick={login} />
    </div>
  );
}
