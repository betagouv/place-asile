import Button from "@codegouvfr/react-dsfr/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export const FiltersReinitializer = ({
  setKey,
}: {
  setKey: (key: string) => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleReinitialisation = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("search");
    params.delete("type");
    params.delete("bati");
    params.delete("places");
    params.delete("departements");
    console.log("params", params.toString());
    router.replace(`?${params.toString()}`);
    setKey(uuidv4());
  };

  return (
    <Button
      priority="tertiary no outline"
      className="w-full -mt-2 flex justify-center"
      onClick={handleReinitialisation}
    >
      Réinitialiser les filtres
    </Button>
  );
};
