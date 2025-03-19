import type { Metadata } from "next";
import { Menu } from "../components/Menu";

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
    <main className="w-full d-flex h-100vh" id="content">
      <Menu />
      <div className="w-full">{children}</div>
    </main>
  );
}
