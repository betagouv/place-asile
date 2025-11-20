import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Repartition } from "@/types/adresse.type";

export const FiltersBatis = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bati, setBati] = useState(searchParams.get("bati")?.split(",") || []);

  const noBatiSelected = bati.length === 0;

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (noBatiSelected) {
      const everyTypes: Repartition[] = [
        Repartition.COLLECTIF,
        Repartition.DIFFUS,
        Repartition.MIXTE,
      ];
      setBati(everyTypes.filter((type) => type !== value));
      return;
    }
    if (bati.includes(value)) {
      setBati(bati.filter((type) => type !== value));
    } else {
      if (bati.length >= 2) {
        setBati([]);
      } else {
        setBati([...bati, value]);
      }
    }
  };

  const prevBati = useRef(bati);
  useEffect(() => {
    if (prevBati.current !== bati) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("bati", bati.join(","));
      router.replace(`?${params.toString()}`);
      prevBati.current = bati;
    }
  }, [bati, searchParams, router]);

  return (
    <div className="px-4 pt-3 pb-4">
      <fieldset>
        <legend className="text-title-blue-france text-sm font-medium mb-4">
          Bâti
        </legend>
        <div className="grid grid-cols-3 gap-x-3 gap-y-2">
          <Checkbox
            options={[
              {
                label: "Collectif",
                nativeInputProps: {
                  name: "structure-bati",
                  value: "COLLECTIF",
                  checked: bati.includes("COLLECTIF") || noBatiSelected,
                  onChange: handleTypeChange,
                },
              },
            ]}
            className={"[&_label]:text-sm [&_label]:leading-6 [&_label]:pb-0"}
            small
          />
          <Checkbox
            options={[
              {
                label: "Diffus",
                nativeInputProps: {
                  name: "structure-bati",
                  value: "DIFFUS",
                  checked: bati.includes("DIFFUS") || noBatiSelected,
                  onChange: handleTypeChange,
                },
              },
            ]}
            className={"[&_label]:text-sm [&_label]:leading-6 [&_label]:pb-0"}
            small
          />
          <Checkbox
            options={[
              {
                label: "Mixte",
                nativeInputProps: {
                  name: "structure-bati",
                  value: "MIXTE",
                  checked: bati.includes("MIXTE") || noBatiSelected,
                  onChange: handleTypeChange,
                },
              },
            ]}
            className={"[&_label]:text-sm [&_label]:leading-6 [&_label]:pb-0"}
            small
          />
        </div>
      </fieldset>
    </div>
  );
};
