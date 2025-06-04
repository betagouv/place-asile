import { ReactElement, Suspense } from "react";
import PasswordForm from "./PasswordForm";

function PasswordFormWrapper(): ReactElement {
  return <PasswordForm />;
}

export default function MotDePasse(): ReactElement {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PasswordFormWrapper />
    </Suspense>
  );
}
