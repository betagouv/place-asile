import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router";
import { ReactElement } from "react";

import { Structure } from "./_components/Structure";

export default async function StructureDetails(): Promise<ReactElement> {
  return (
    <>
      <StartDsfrOnHydration />
      <Structure />
    </>
  );
}
