import type { Metadata } from "next";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "./globals.css";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const metadata: Metadata = {
  title: "Place d'asile",
  description: "Simplifier les demandes d'hébergement des demandeurs d'asile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="w-full" id="content">
          <div className="fr-container fr-my-2w">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
