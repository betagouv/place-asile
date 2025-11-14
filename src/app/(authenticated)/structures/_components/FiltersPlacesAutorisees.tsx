import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const FiltersPlacesAutorisees = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [placesAutorisees, setPlacesAutorisees] = useState(
    searchParams.get("placesAutorisees")?.split(",") || []
  );

  const noPlacesAutoriseesSelected = placesAutorisees.length === 0;

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (noPlacesAutoriseesSelected) {
      const everyTypes = ["COLLECTIF", "DIFFUS", "MIXTE"];
      setPlacesAutorisees(everyTypes.filter((t) => t !== value));
      return;
    }
    if (placesAutorisees.includes(value)) {
      setPlacesAutorisees(placesAutorisees.filter((t) => t !== value));
    } else {
      setPlacesAutorisees([...placesAutorisees, value]);
    }
  };

  const prevPlacesAutorisees = useRef(placesAutorisees);
  useEffect(() => {
    if (prevPlacesAutorisees.current !== placesAutorisees) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("placesAutorisees", placesAutorisees.join(","));
      router.replace(`?${params.toString()}`);
      prevPlacesAutorisees.current = placesAutorisees;
    }
  }, [placesAutorisees, searchParams, router]);

  return (
    <div className="px-4 pt-3 pb-4">
      <fieldset>
        <legend className="text-title-blue-france text-sm font-medium mb-4">
          Places autorisées
        </legend>
        <div className="grid grid-cols-3 gap-x-3 gap-y-2">Slider</div>
      </fieldset>
    </div>
  );
};
