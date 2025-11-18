import Button from "@codegouvfr/react-dsfr/Button";
import { useRouter, useSearchParams } from "next/navigation";

export const FiltersResetter = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
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

    router.replace(`?${params.toString()}`);
    setIsOpen(false);
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
