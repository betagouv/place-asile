import { fr } from "@codegouvfr/react-dsfr";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { DEPARTEMENTS } from "@/constants";

import { FiltersRegions } from "./FiltersRegions";

export const FiltersDepartement = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [departements, setDepartements] = useState<string[]>(
    searchParams.get("departements")?.split(",") || []
  );

  const regions = useMemo(() => {
    return [
      ...new Set(DEPARTEMENTS.map((departement) => departement.region)),
    ].sort((a, b) => a.localeCompare(b));
  }, []);

  const prevDepartements = useRef(departements);
  useEffect(() => {
    if (prevDepartements.current !== departements) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("departements", departements.join(","));
      router.replace(`?${params.toString()}`);
      prevDepartements.current = departements;
    }
  }, [departements, searchParams, router]);

  return (
    <div>
      <div className={fr.cx("fr-accordions-group")}>
        {regions.map((region) => (
          <FiltersRegions
            region={region}
            key={region}
            departements={departements}
            setDepartements={setDepartements}
          >
            <>
              {DEPARTEMENTS.filter(
                (departement) => departement.region === region
              )
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((departement) => (
                  <Checkbox
                    key={departement.numero}
                    options={[
                      {
                        label: departement.name,
                        nativeInputProps: {
                          name: "structure-departement",
                          value: departement.numero,
                          onChange: (e) => {
                            console.log(e.target.value);
                          },
                        },
                      },
                    ]}
                    className={
                      "[&_label]:text-sm [&_label]:leading-6 [&_label]:pb-0 mb-1"
                    }
                    small
                  />
                ))}
            </>
          </FiltersRegions>
        ))}
      </div>
    </div>
  );
};
