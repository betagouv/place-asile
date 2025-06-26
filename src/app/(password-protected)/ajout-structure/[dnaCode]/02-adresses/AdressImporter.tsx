import { SPREADSHEET_MIME_TYPES } from "@/constants";
import { ReactElement, useState } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { useSpreadsheetParse } from "@/app/hooks/useSpreadsheetParse";
import { Repartition } from "@/types/adresse.type";
import { AdressesFormValues } from "../../../../components/forms/structures/validation/adressesSchema";

export const AdressImporter = ({
  getValues,
  setValue,
  typeBati,
}: Props): ReactElement => {
  const [parsingError, setParsingError] = useState("");
  const { parseAdressesDiffuses, parseAdressesMixtes } = useSpreadsheetParse();

  const onAdressesUpload = async (
    getValues: UseFormGetValues<AdressesFormValues>,
    setValue: UseFormSetValue<AdressesFormValues>,
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
        if (
          currentAddresses.length === 1 &&
          currentAddresses[0].adresse === ""
        ) {
          const updatedAddresses = [...newAdresses];
          setValue("adresses", updatedAddresses, {
            shouldValidate: false,
          });
        } else {
          const updatedAddresses = [...currentAddresses, ...newAdresses];
          setValue("adresses", updatedAddresses, {
            shouldValidate: false,
          });
        }
        setParsingError("");
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
        className="file:bg-white file:p-2 file:rounded file:mr-2 file:cursor-pointer"
        onChange={() => onAdressesUpload(getValues, setValue, typeBati)}
      />
      {parsingError && (
        <p className="text-red-500">{parsingError.toString()}</p>
      )}
    </div>
  );
};

type Props = {
  getValues: UseFormGetValues<AdressesFormValues>;
  setValue: UseFormSetValue<AdressesFormValues>;
  typeBati: Repartition;
};
