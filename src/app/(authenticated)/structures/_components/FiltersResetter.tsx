import Button from "@codegouvfr/react-dsfr/Button";
import { useRouter, useSearchParams } from "next/navigation";

export const FiltersResetter = ({
  closePanel,
  label = "Réinitialiser les filtres",
  filters = ["search", "type", "bati", "places"],
}: {
  closePanel: () => void;
  label?: string;
  filters?: string[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleReset = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    filters.forEach((filter) => {
      params.delete(filter);
    });

    router.replace(`?${params.toString()}`);
    closePanel();
  };

  return (
    <Button
      priority="tertiary no outline"
      className="w-full -mt-2 flex justify-center"
      onClick={handleReset}
    >
      {label}
    </Button>
  );
};
