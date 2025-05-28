import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { AdressesSchema } from "../../../validation/validation";
import { useParams } from "next/navigation";
import { z } from "zod";
import { CustomTag } from "@/app/components/ui/CustomTag";

type AdressesFormValues = z.infer<typeof AdressesSchema>;
export const Adresses = () => {
  const params = useParams();
  const { currentValue: localStorageValues } = useLocalStorage<
    Partial<AdressesFormValues>
  >(`ajout-structure-${params.dnaCode}-adresses`, {});

  return (
    <>
      <h3 className="text-title-blue-france w-full flex justify-between text-lg">
        Adresse administrative
      </h3>
      <p>
        {localStorageValues?.adresseAdministrative}{" "}
        {localStorageValues?.codePostalAdministratif}{" "}
        {localStorageValues?.communeAdministrative}
      </p>
      {localStorageValues?.adresses &&
        localStorageValues.adresses.length > 0 && (
          <h3 className="text-title-blue-france w-full flex justify-between text-lg">
            Hébergements
          </h3>
        )}
      {localStorageValues?.adresses?.map((hebergement, index) => {
        return (
          <p
            key={`${index}-${hebergement.codePostal}`}
            className="flex gap-1 mb-2"
          >
            {hebergement?.adresseComplete && (
              <span>{hebergement?.adresseComplete}</span>
            )}
            {hebergement?.places && <span>({hebergement?.places})</span>}
            {hebergement?.repartition && (
              <span>– {hebergement?.repartition}</span>
            )}
            {hebergement?.qpv && <CustomTag>QPV</CustomTag>}
            {hebergement?.logementSocial && (
              <CustomTag>Logement social</CustomTag>
            )}
          </p>
        );
      })}
    </>
  );
};
