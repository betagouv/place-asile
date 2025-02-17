"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

export const Menu = (): ReactElement => {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: "fr-icon-community-line",
      label: "Centres",
      url: "/centres",
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

  const getActiveClass = (url: string): string => {
    return pathname === url ? "fr-sidemenu__item--active" : "";
  };

  const getAriaCurrent = (url: string): "page" | boolean => {
    return pathname === url ? "page" : false;
  };

  return (
    <nav className="fr-sidemenu fr-p-2w left-menu no-shrink">
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
    </nav>
  );
};
