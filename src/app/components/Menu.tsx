"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";
import { ExternalLink } from "./common/ExternalLink";

export const Menu = (): ReactElement => {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: "fr-icon-community-line",
      label: "Structures d’hébergement",
      url: "/structures",
    },
    {
      icon: "fr-icon-user-setting-line",
      label: "Opérateurs",
      url: "/operateurs",
    },
    {
      icon: "fr-icon-pie-chart-2-line",
      label: "Statistiques",
      url: "/statistiques",
    },
  ];

  const secondaryMenuItems = [
    {
      label: "Politique de confidentialité",
      url: "/confidentialite",
    },
    {
      label: "Accessibilité : partiellement conforme",
      url: "/accessibilite",
    },
    {
      label: "Code source",
      url: "https://github.com/betagouv/place-asile",
      isExternalLink: true,
    },
  ];

  const getActiveClass = (url: string): string => {
    return pathname === url ? "fr-sidemenu__item--active" : "";
  };

  const getAriaCurrent = (url: string): "page" | boolean => {
    return pathname === url ? "page" : false;
  };

  return (
    <nav className="fr-sidemenu fr-p-2w left-menu no-shrink d-flex flex-column">
      <ul className="fr-sidemenu__list">
        {menuItems.map((menuItem) => (
          <li
            className={`fr-sidemenu__item ${getActiveClass(menuItem.url)}`}
            key={menuItem.label}
          >
            <Link
              className="fr-sidemenu__link"
              href={menuItem.url}
              aria-current={getAriaCurrent(menuItem.url)}
            >
              <span className={menuItem.icon}>{menuItem.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="grow" />
      <ul>
        {secondaryMenuItems.map((menuItem) => (
          <li className="text-grey fr-text--xs" key={menuItem.label}>
            {menuItem.isExternalLink ? (
              <ExternalLink title={menuItem.label} url={menuItem.url} />
            ) : (
              <Link href={menuItem.url}>
                <span>{menuItem.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
