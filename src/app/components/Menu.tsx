import Link from "next/link";

export const Menu = () => {
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

  return (
    <nav className="fr-sidemenu fr-pt-2w">
      <ul className="fr-sidemenu__list">
        {menuItems.map((menuItem) => (
          <li className="fr-sidemenu__item" key={menuItem.label}>
            <Link
              className={`fr-sidemenu__link ${menuItem.icon}`}
              href={menuItem.url}
            >
              {menuItem.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
