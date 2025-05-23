import { SPREADSHEET_MIME_TYPES } from "@/constants";
import { ReactElement, useState } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { useSpreadsheetParse } from "@/app/hooks/useSpreadsheetParse";
import { Repartition } from "@/types/adresse.type";

export const AdressImporter = ({
  getValues,
  setValue,
  typeBati,
}: Props): ReactElement => {
  const [parsingError, setParsingError] = useState("");
  const { parseAdressesDiffuses, parseAdressesMixtes } = useSpreadsheetParse();

  const onAdressesUpload = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValues: UseFormGetValues<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: UseFormSetValue<any>,
    typeBati: Repartition
  ): Promise<void> => {
    const input = document.getElementById("adresses-upload");
    const file = (input as HTMLInputElement).files?.[0];
    if (file) {
      const parseFunction =
        typeBati === Repartition.DIFFUS
          ? parseAdressesDiffuses
          : parseAdressesMixtes;
      try {
        const newAdresses = await parseFunction(file);
        const currentAddresses = getValues("adresses") || [];
        const updatedAddresses = [...currentAddresses, ...newAdresses];
        setValue("adresses", updatedAddresses, {
          shouldValidate: false,
        });
      } catch (error) {
        const sanitizedError = (error as string)
          .toString()
          .replaceAll("Error: ", "");
        setParsingError(sanitizedError);
      }
    }
  };

  return (
    <div className="grid items-center justify-center bg-alt-blue-france p-4 rounded min-h-[4rem]">
      <input
        type="file"
        id="adresses-upload"
        accept={SPREADSHEET_MIME_TYPES.join(",")}
        onChange={() => onAdressesUpload(getValues, setValue, typeBati)}
      />
      {parsingError && (
        <p className="text-red-500">{parsingError.toString()}</p>
      )}
    </div>
  );
};

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValues: UseFormGetValues<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  typeBati: Repartition;
};
