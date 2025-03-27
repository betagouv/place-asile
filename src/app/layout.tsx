import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { Providers } from "./Providers";
import {
  DsfrHead,
  getHtmlAttributes,
} from "./dsfr-bootstrap/server-only-index";
import { DsfrProvider } from "./dsfr-bootstrap";
import "./globals.css";

export const metadata: Metadata = {
  title: "Place d'asile",
  description: "Simplifier les demandes d'hébergement des demandeurs d'asile",
};

export default function RootLayout({ children }: PropsWithChildren) {
  const lang = "fr";
  return (
    <html {...getHtmlAttributes({ lang })} dir="ltr">
      <head>
        <DsfrHead />
      </head>
      <body>
        <DsfrProvider lang={lang}>
          <Providers>{children}</Providers>
        </DsfrProvider>
      </body>
    </html>
  );
}
