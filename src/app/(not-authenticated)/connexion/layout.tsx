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
    <main className="h-full w-full align-center" id="content">
      {children}
    </main>
  );
}
