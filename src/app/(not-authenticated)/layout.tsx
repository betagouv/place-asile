import { Footer } from "@/app/components/common/Footer";
import { Header } from "@/app/components/common/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Place d'asile - Connexion",
  description: "Simplifier les demandes d'hébergement des demandeurs d'asile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-full w-full" id="content">
      <Header />
      <div className="align-justify-center">{children}</div>
      <Footer />
    </main>
  );
}
