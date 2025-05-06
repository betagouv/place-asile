import Link from "next/link";
import { ReactElement } from "react";

const menuElements = [
  { label: "Description", section: "#description" },
  { label: "Calendrier", section: "#calendrier" },
  { label: "Type de places", section: "#places" },
  { label: "Contrôle qualité", section: "#controle" },
  { label: "Activites", section: "#activites" },
  { label: "Notes", section: "#notes" },
];

export const NavigationMenu = (): ReactElement => {
  return (
    <nav className="fr-nav border-bottom">
      <ul className="fr-nav__list">
        {menuElements.map((menuElement) => (
          <li key={menuElement.label} className="fr-nav__item">
            <Link
              className="fr-nav__link text-title-blue-france font-bold"
              href={menuElement.section}
            >
              {menuElement.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
