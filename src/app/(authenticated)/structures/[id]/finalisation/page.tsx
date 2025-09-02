// TODO @ledjay : remove this page at the end of dev
import Link from "next/link";
import { ReactElement } from "react";

import { steps } from "./components/Steps";

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

      {steps.map((step, index) => (
        <Link
          key={index}
          href={`/structures/${dnaCode}/finalisation/${step.route}`}
        >
          {index + 1}. {step.title}
        </Link>
      ))}
    </div>
  );
}
