import { ReactElement, Suspense } from "react";
import PasswordForm from "./PasswordForm";

function PasswordFormWrapper(): ReactElement {
  return <PasswordForm />;
}

export default function MotDePasse(): ReactElement {
  // TODO : rediriger les autres pages vers celle-ci quand le mot de passe n'a pas été renseigné
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PasswordFormWrapper />
    </Suspense>
  );
}
