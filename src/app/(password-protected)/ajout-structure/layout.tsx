"use client";

import { Logo } from "@/app/components/Logo";
import { useParams } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const dnaCode = params.dnaCode;

  return (
    <>
      <header className="bg-white">
        <div className="fr-container flex py-4 gap-4 items-center">
          <div className="fr-header__logo order-none p-0">
            <p className="fr-logo">
              République
              <br />
              française
            </p>
          </div>
          <Logo />
          <p className="flex flex-col uppercase font-bold gap-1 text-action-high-blue-france m-0">
            <span className="text-xs leading-none">Ajouter une structure</span>
            <span className="text-xl leading-none">{dnaCode}</span>
          </p>
        </div>
      </header>
      <main
        className="h-full w-full relative border border-transparent"
        id="content"
      >
        <div className="fr-container mx-auto my-10">{children}</div>
      </main>
    </>
  );
}
