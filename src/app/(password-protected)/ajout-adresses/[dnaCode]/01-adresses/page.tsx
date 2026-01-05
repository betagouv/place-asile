import { AdressesRecovery } from "./_components/AdressesRecovery";

export default async function AjoutAdressesPage({
  params,
}: {
  params: Promise<{ dnaCode: string }>;
}) {
  const { dnaCode } = await params;

  return (
    <div>
      <h2>Adresses</h2>
      <AdressesRecovery dnaCode={dnaCode} />
    </div>
  );
}
