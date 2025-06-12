import "../../build.css";
import "./globals.css"; // IMPORTANT cet import doit rester en premier pour que les layers css soient respectés

import type { Metadata } from "next";
import { PropsWithChildren, useEffect } from "react";
import { Providers } from "./Providers";
import {
  DsfrHead,
  getHtmlAttributes,
} from "./dsfr-bootstrap/server-only-index";
import { DsfrProvider } from "./dsfr-bootstrap";
import { init } from "@socialgouv/matomo-next";

export const metadata: Metadata = {
  title: "Place d'asile",
  description: "Simplifier les demandes d'hébergement des demandeurs d'asile",
};

export default function RootLayout({ children }: PropsWithChildren) {
  console.log("Environnement :", process.env.NODE_ENV);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      init({
        url: process.env.MATOMO_URL!,
        siteId: process.env.MATOMO_SITE_ID!,
        disableCookies: true,
      });
    }
  }, []);

  const lang = "fr";
  return (
    <html {...getHtmlAttributes({ lang })} dir="ltr">
      <head>
        <DsfrHead />
      </head>
      <body className="overscroll-none bg-default-grey-hover">
        <DsfrProvider lang={lang}>
          <Providers>{children}</Providers>
        </DsfrProvider>
      </body>
    </html>
  );
}
