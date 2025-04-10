import { Structure } from "@/types/structure.type";
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router";
import { ReactElement } from "react";
import StructureContent from "./StructureContent";

export default async function StructureDetails({
  params,
}: Params): Promise<ReactElement> {
  const { id } = await params;
  const result = await fetch(`${process.env.NEXT_URL}/api/structures/${id}`);
  const structure: Structure = await result.json();

  return (
    <>
      <StartDsfrOnHydration />
      <StructureContent structure={structure} />
    </>
  );
}

type Params = {
  params: Promise<{ id: number }>;
};
