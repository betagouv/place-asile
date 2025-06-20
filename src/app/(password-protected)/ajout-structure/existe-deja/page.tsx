"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { PLACE_ASILE_CONTACT_EMAIL } from "@/constants";
import { CustomTag } from "@/app/components/ui/CustomTag";

export default function ExisteDeja() {
  const searchParams = useSearchParams();
  const dnaCode = searchParams.get("dnaCode");

  return (
    <div className="max-w-xl mx-auto mt-auto h-[calc(50vh-12rem)] text-center flex flex-col items-center justify-center animate-fade-in border bg-white shadow-md p-12 border-default-grey rounded">
      <h1>Structure existante</h1>
      <p>
        La structure <CustomTag className="inline">{dnaCode}</CustomTag> que
        vous souhaitez ajouter existe déjà.
      </p>
      <p>
        Si vous pensez qu’il s’agit d’une erreur, merci de contacter notre
        support .
      </p>
      <Button
        linkProps={{
          href: `mailto:${PLACE_ASILE_CONTACT_EMAIL}?subject=Structure%20existante%20-%20${dnaCode}`,
          target: "_blank",
          rel: "noopener noreferrer",
        }}
      >
        {PLACE_ASILE_CONTACT_EMAIL}
      </Button>
    </div>
  );
}
