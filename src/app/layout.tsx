import "../../build.css";
import "./globals.css"; // IMPORTANT cet import doit rester en premier pour que les layers css soient respectés

import type { Metadata } from "next";
import { PropsWithChildren, Suspense } from "react";
import { Providers } from "./Providers";
import {
  DsfrHead,
  getHtmlAttributes,
} from "./dsfr-bootstrap/server-only-index";
import { DsfrProvider } from "./dsfr-bootstrap";

export const metadata: Metadata = {
  title: "Place d'asile",
  description: "Piloter le parc de logements pour demandeurs d’asile",
};

export default function RootLayout({ children }: PropsWithChildren) {
  console.log("Environnement :", process.env.NODE_ENV);

  const lang = "fr";
  return (
    <html {...getHtmlAttributes({ lang })} dir="ltr">
      <head>
        <DsfrHead />
      </head>
      <body className="overscroll-none bg-default-grey-hover">
        <DsfrProvider lang={lang}>
          <Providers>
            <Suspense>{children}</Suspense>
          </Providers>
        </DsfrProvider>
      </body>
    </html>
  );
}
