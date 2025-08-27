import { redirect } from "next/navigation";

import { Structure } from "@/types/structure.type";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ dnaCode: string }>;
}>) {
  const { dnaCode } = await params;

  try {
    const result = await fetch(`/api/structures/dna/${dnaCode}`, {
      next: { revalidate: 0 },
    });

    if (!result.ok) {
      if (result.status === 404) {
        return <>{children}</>;
      }

      console.error(`API error: ${result.status}`, await result.text());
      return <>{children}</>;
    }

    const structure: Structure | null = await result.json();

    if (structure) {
      redirect(`/ajout-structure/existe-deja?dnaCode=${dnaCode}`);
    }
  } catch (error) {
    console.error("Error checking for existing structure:", error);
    throw error;
  }

  return <>{children}</>;
}
