import { Footer } from "@/app/components/common/Footer";
import { Header } from "@/app/components/common/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Place d'asile - Connexion",
  description: "Piloter le parc de logements pour demandeurs d’asile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-full w-full" id="content">
      <Header />
      <div className="flex justify-center items-center">{children}</div>
      <Footer />
    </main>
  );
}
