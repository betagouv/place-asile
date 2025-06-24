import { StructureWithLatLng } from "@/types/structure.type";
import { StructureProvider } from "./context/StructureContext";
import { notFound } from "next/navigation";
import { StructureHeader } from "./(header)/StructureHeader";
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router";

async function getStructure(id: string): Promise<StructureWithLatLng> {
  try {
    // Use NEXT_URL instead of NEXT_PUBLIC_BASE_URL
    const baseUrl = process.env.NEXT_URL || "";
    const result = await fetch(`${baseUrl}/api/structures/${id}`, {
      cache: "no-store",
    });

    if (!result.ok) {
      throw new Error(`Failed to fetch structure: ${result.status}`);
    }

    return await result.json();
  } catch (error) {
    console.error("Error fetching structure:", error);
    notFound();
  }
}

export default async function StructureLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { id } = await params;
  const structure = await getStructure(id);

  if (!structure) {
    notFound();
  }

  return (
    <StructureProvider structure={structure}>
      <StartDsfrOnHydration />

      <div className="flex flex-col h-full bg-grey gap-2 pb-4">
        <StructureHeader />
        {children}
      </div>
    </StructureProvider>
  );
}
