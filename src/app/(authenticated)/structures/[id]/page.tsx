import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router";
import { ReactElement } from "react";

import StructureContent from "./_components/StructureContent";

export default async function StructureDetails(): Promise<ReactElement> {
  return (
    <>
      <StartDsfrOnHydration />
      <StructureContent />
    </>
  );
}
