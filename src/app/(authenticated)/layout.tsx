import type { Metadata } from "next";
import { Header } from "../components/Header";
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
    <>
      <Header />
      <main className="w-full d-flex" id="content">
        <Menu />
        <div className="w-full">{children}</div>
      </main>
    </>
  );
}
