import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";

import { cn } from "@/app/utils/classname.util";
import { DEPARTEMENTS } from "@/constants";

export const FiltersRegions = ({
  region,
  departements,
  setDepartements,
  children,
}: Props) => {
  const checkboxWrapperRef = useRef<HTMLDivElement>(null);

  // We need to stop the propagation of the native event
  // to avoid opening the accordion when clicking on the checkbox
  useEffect(() => {
    const wrapper = checkboxWrapperRef.current;
    if (!wrapper) return;

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    wrapper.addEventListener("click", handleClick, true);
    wrapper.addEventListener("mousedown", handleMouseDown, true);

    return () => {
      wrapper.removeEventListener("click", handleClick, true);
      wrapper.removeEventListener("mousedown", handleMouseDown, true);
    };
  }, []);

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    const region = event.target.value;
    setDepartements((prevDepartements) => {
      const newDepartements = [
        ...prevDepartements,
        ...DEPARTEMENTS.filter(
          (departement) => departement.region === region
        ).map((departement) => departement.numero),
      ];
      return [...new Set(newDepartements)];
    });
  };

  const checkedStatus = useMemo(() => {
    const numOfDepartementsInRegion = DEPARTEMENTS.filter(
      (departement) => departement.region === region
    ).length;

    const numOfDepartementsChecked = departements.filter((departement) =>
      DEPARTEMENTS.some((d) => d.numero === departement)
    ).length;

    if (numOfDepartementsChecked === numOfDepartementsInRegion) {
      return "checked";
    }
    if (numOfDepartementsChecked > 0) {
      return "incomplete";
    }
    return "unchecked";
  }, [departements, region]);

  return (
    <Accordion
      className={cn(
        "[&:before]:content-none",
        "[&>h3>button]:py-1.5 [&>h3>button]:min-h-0 [&>h3>button]:bg-transparent!",
        "[&>div]:py-0 [&>div]:px-6"
      )}
      label={
        <div ref={checkboxWrapperRef}>
          <Checkbox
            options={[
              {
                label: region,
                nativeInputProps: {
                  name: "structure-region",
                  value: region,
                  onChange: (e) => {
                    console.log(e.target.value);
                    handleRegionChange(e);
                  },
                  checked: checkedStatus === "checked",
                },
              },
            ]}
            className={
              "[&_label]:text-sm [&_label]:leading-6 [&_label]:pb-0 [&_label]:text-title-blue-france"
            }
            small
          />
        </div>
      }
    >
      {children}
    </Accordion>
  );
};

type Props = {
  region: string;
  departements: string[];
  setDepartements: Dispatch<SetStateAction<string[]>>;
  children: React.ReactElement;
};
