import { ReactElement } from "react";
import { useSession } from "next-auth/react";
import styles from "./User.module.css";
import { redirect } from "next/navigation";

export const User = (): ReactElement => {
  const session = useSession();

  return (
    <div className="align-center">
      <div className={`${styles.avatar} fr-icon-user-line`} />
      <div>
        <p className="fr-text--sm text-title-blue-france">
          {session.data?.user?.name || session.data?.user?.email}
        </p>
        <button
          className="fr-text--xs fr-p-0 fr-icon-logout-box-r-line fr-btn--icon-right"
          onClick={() => redirect("/deconnexion")}
        >
          Deconnexion
        </button>
      </div>
    </div>
  );
};
