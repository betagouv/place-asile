import Button from "@codegouvfr/react-dsfr/Button";
import { useRouter, useSearchParams } from "next/navigation";

export const FiltersResetter = ({
  closePanel,
  label = "Réinitialiser les filtres",
  filters = ["search", "type", "bati", "places"],
  isActive,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleReinitialisation = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    filters.forEach((filter) => {
      params.delete(filter);
    });

    router.replace(`?${params.toString()}`);
    closePanel();
  };

  return (
    <Button
      disabled={!isActive}
      priority="tertiary no outline"
      className="w-full -mt-2 flex justify-center"
      onClick={handleReinitialisation}
    >
      {label}
    </Button>
  );
};

type Props = {
  closePanel: () => void;
  label?: string;
  filters?: string[];
  isActive: boolean;
};
