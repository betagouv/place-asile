import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { AdressesSchema } from "../../../validation/adressesSchema";
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
      <div className="grid border-b border-default-grey pb-2 mb-3">
        <p className="flex gap-4 mb-0">
          <b>Nom de la structure</b> {localStorageValues?.nom}
        </p>
      </div>
      <div className="grid border-b border-default-grey pb-2 mb-3">
        <p className="flex gap-4 mb-0">
          <b>Adresse principale de la structure</b>{" "}
          {localStorageValues?.adresseAdministrative}{" "}
          {localStorageValues?.codePostalAdministratif}{" "}
          {localStorageValues?.communeAdministrative}
        </p>
      </div>
      <div className="grid border-b border-default-grey pb-2 mb-3">
        <p className="flex gap-4 mb-0">
          <b>Type de bâti de la structure</b> {localStorageValues?.typeBati}
        </p>
      </div>
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
            {hebergement?.places && <span>({hebergement?.places} places)</span>}
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
