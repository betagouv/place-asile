export default async function CentreDetails({ params }: Params) {
  const { id } = await params;
  const result = await fetch(`${process.env.URL}/api/centres/${id}`);
  const centre = await result.json();
  return (
    <>
      <p>Id: {centre.id}</p>
      <p>Adresse: {centre.adresseHebergement}</p>
    </>
  );
}

type Params = {
  params: { id: number };
};
