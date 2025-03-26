import type { Metadata } from "next";
import { PropsWithChildren } from "react";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-document/icons-document.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-map/icons-map.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.min.css";
import "./globals.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "Place d'asile",
  description: "Simplifier les demandes d'hébergement des demandeurs d'asile",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html data-fr-scheme="light" dir="ltr" lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
