import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { StructureType } from "@/types/structure.type";

export const FiltersTypes = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get("type")?.split(",") || []);

  const noTypeSelected = type.length === 0;

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (noTypeSelected) {
      const everyTypes: StructureType[] = [
        StructureType.CADA,
        StructureType.CPH,
        StructureType.HUDA,
        StructureType.CAES,
        StructureType.PRAHDA,
      ];
      setType(everyTypes.filter((t) => t !== value));
      return;
    }
    if (type.includes(value)) {
      setType(type.filter((t) => t !== value));
    } else {
      if (type.length >= 4) {
        setType([]);
      } else {
        setType([...type, value]);
      }
    }
  };

  const prevType = useRef(type);
  useEffect(() => {
    if (prevType.current !== type) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("type", type.join(","));
      router.replace(`?${params.toString()}`);
      prevType.current = type;
    }
  }, [type, searchParams, router]);

  return (
    <div className="p-4">
      <fieldset>
        <legend className="text-title-blue-france text-sm font-medium mb-4">
          Type de structure
        </legend>
        <div className="grid grid-cols-3 gap-x-3 gap-y-2">
          <Checkbox
            options={[
              {
                label: "CADA",
                nativeInputProps: {
                  name: "structure-type",
                  value: "CADA",
                  checked: type.includes("CADA") || noTypeSelected,
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
                label: "CPH",
                nativeInputProps: {
                  name: "structure-type",
                  value: "CPH",
                  checked: type.includes("CPH") || noTypeSelected,
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
                label: "HUDA",
                nativeInputProps: {
                  name: "structure-type",
                  value: "HUDA",
                  checked: type.includes("HUDA") || noTypeSelected,
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
                label: "CAES",
                nativeInputProps: {
                  name: "structure-type",
                  value: "CAES",
                  checked: type.includes("CAES") || noTypeSelected,
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
                label: "PRAHDA",
                nativeInputProps: {
                  name: "structure-type",
                  value: "PRAHDA",
                  checked: type.includes("PRAHDA") || noTypeSelected,
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
