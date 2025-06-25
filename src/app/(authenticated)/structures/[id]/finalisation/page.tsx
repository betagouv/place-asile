// TODO @ledjay : remove this page at the end of dev
import { ReactElement } from "react";
import Link from "next/link";

export default async function Finalisation({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<ReactElement> {
  const dnaCode = (await params).id;
  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded border border-default-grey mx-2">
      <h1>Finalisation</h1>
      <Link href="/structures">Retour aux structures</Link>
      <Link href={`/structures/${dnaCode}`}>Retour à la structure</Link>
      <Link href={`/structures/${dnaCode}/finalisation/01-identification`}>
        Identification
      </Link>
      <Link href={`/structures/${dnaCode}/finalisation/02-contacts`}>
        Contacts
      </Link>
      <Link href={`/structures/${dnaCode}/finalisation/03-calendrier`}>
        Calendrier
      </Link>
      <Link href={`/structures/${dnaCode}/finalisation/04-type-places`}>
        Type de places
      </Link>
      <Link href={`/structures/${dnaCode}/finalisation/05-controles`}>
        Controles
      </Link>
      <Link href={`/structures/${dnaCode}/finalisation/06-activites`}>
        Activités
      </Link>
      <Link href={`/structures/${dnaCode}/finalisation/07-notes`}>Notes</Link>
      <Link href={`/structures/${dnaCode}/finalisation/08-finances`}>
        Finances
      </Link>
    </div>
  );
}
