import type { Metadata } from "next";

import { Menu } from "../components/Menu";

export const metadata: Metadata = {
  title: "Place d'asile",
  description: "Piloter le parc de logements pour demandeurs d’asile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full max-w-screen flex bg-white" id="content">
      <Menu />
      <div className="w-[80vw]">{children}</div>
    </main>
  );
}
