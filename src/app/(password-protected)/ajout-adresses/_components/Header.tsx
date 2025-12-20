"use client";

import { Logo } from "@/app/components/Logo";

export const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="fr-container flex py-4 gap-4 items-center">
        <div className="fr-header__logo order-none p-0">
          <p className="fr-logo">
            République
            <br />
            française
          </p>
        </div>
        <Logo />
      </div>
    </header>
  );
};
