"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ReactElement, useState } from "react";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { verifyPassword } from "./actions";
import { Header } from "@/app/components/common/Header";
import { Footer } from "@/app/components/common/Footer";

export default function PasswordForm(): ReactElement {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/ajout-structure";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await verifyPassword(password, redirectTo);

      if (result.success) {
        if (result.redirectTo) {
          // Handle client-side navigation
          router.push(result.redirectTo);
        }
      } else {
        setError("Mot de passe incorrect");
      }
    } catch (error) {
      console.error("Error during password verification:", error);
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <>
      <style>{`
      body {
       background-color: var(--color-background-default-grey-hover); 
      }
      `}</style>
      <Header />
      <main className="p-8 min-h-[50vh]  grid place-items-center fr-container max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full border bg-white shadow-md p-12 border-default-grey rounded"
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
      </main>
      <Footer />
    </>
  );
}
