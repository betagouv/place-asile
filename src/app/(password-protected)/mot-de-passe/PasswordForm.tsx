"use client";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactElement, useState } from "react";

import { Footer } from "@/app/components/common/Footer";
import { Header } from "@/app/components/common/Header";

import { verifyPassword } from "./actions";

export default function PasswordForm(): ReactElement {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/ajout-structure";
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await verifyPassword(password);

      if (result.success) {
        router.push(redirectTo);
      } else {
        setError(result.message || "Mot de passe incorrect");
      }
    } catch (error) {
      console.error("Error during password verification:", error);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="p-8 min-h-[50vh] grid place-items-center fr-container max-w-2xl">
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
              disabled: isSubmitting,
            }}
            label="Mot de passe"
            addon={
              <Button disabled={isSubmitting}>
                {isSubmitting ? "Vérification..." : "Valider"}
              </Button>
            }
            state={error ? "error" : undefined}
            stateRelatedMessage={error}
          />
        </form>
      </main>
      <Footer />
    </>
  );
}
