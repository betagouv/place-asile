"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ReactElement, useState } from "react";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";

export default function PasswordForm(): ReactElement {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/ajout-structure";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/mot-de-passe", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(redirectTo);
    } else {
      setError("Mot de passe incorrect");
    }
  };

  return (
    <div className="p-8 min-h-[50vh] grid place-items-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full border p-12 border-default-grey rounded"
      >
        <h1 className="">Page protégée</h1>
        <p>Cette page est protégée, veuillez saisir le mot de passe.</p>
        <Input
          nativeInputProps={{
            type: "password",
            value: password,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value),
          }}
          label="Mot de passe"
          addon={<Button>Valider</Button>}
          state={error ? "error" : undefined}
          stateRelatedMessage={error}
        />
      </form>
    </div>
  );
}
