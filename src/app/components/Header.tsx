import { ReactElement } from "react";
import { Logo } from "./Logo";

export const Header = (): ReactElement => {
  return (
    <header role="banner" className="border-bottom">
      <div className="space-between">
        <div className="left-menu fr-py-1w">
          <Logo />
        </div>
        <button className="fr-btn fr-btn--icon-left fr-btn--tertiary-no-outline fr-icon-question-line">
          Aide
        </button>
      </div>
    </header>
  );
};
