import type { Metadata } from "next";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Menu } from "./components/Menu";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons.min.css";
import "./globals.css";

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
    <html lang="fr">
      <body>
        <Header />
        <main className="w-full d-flex" id="content">
          <Menu />
          <div className="w-full">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
