import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { DropZone } from "@/app/components/forms/DropZone";
import {
  granularities,
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "@/app/components/forms/finance/documents/documentsStructures";
import {
  DocumentFinancierFlexibleFormValues,
  DocumentsFinanciersFlexibleFormValues,
} from "@/schemas/forms/base/documentFinancier.schema";
import { Granularity } from "@/types/document-financier";
import { DocumentFinancierCategoryType } from "@/types/file-upload.type";

export const YearlyFileUpload = ({
  year,
  index,
  isAutorisee,
  control,
}: Props): ReactElement => {
  const { watch } = useFormContext();
  const documentsFinanciers: DocumentFinancierFlexibleFormValues[] = watch(
    "documentsFinanciers"
  );
  const { append, remove } = useFieldArray({
    control,
    name: "documentsFinanciers",
  });

  const isInCpom = watch(`structureMillesimes.${index}.cpom`);

  const documentTypes = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  const [shouldDisplayCategorySelect, setShouldDisplayCategorySelect] =
    useState(false);
  const [shouldDisplayGranularitySelect, setShouldDisplayGranularitySelect] =
    useState(false);
  const [shouldDisplayNomInput, setShouldDisplayNomInput] = useState(false);
  const [shouldDisplayAddButton, setShouldDisplayAddButton] = useState(false);
  const [shouldEnableAddButton, setShouldEnableAddButton] = useState(false);
  //  key is used to reset the drop zone when a document is added
  const [dropZoneKey, setDropZoneKey] = useState<string>(uuidv4());

  const [key, setKey] = useState<string | undefined>();
  const [category, setCategory] = useState<
    DocumentFinancierCategoryType[number] | undefined
  >();
  const [granularity, setGranularity] = useState<Granularity | undefined>(
    isInCpom ? undefined : Granularity.STRUCTURE
  );
  const [nom, setNom] = useState<string | undefined>();

  useEffect(() => {
    if (key) {
      setShouldDisplayCategorySelect(true);
      setShouldDisplayAddButton(true);
    } else {
      setShouldDisplayCategorySelect(false);
      setShouldDisplayGranularitySelect(false);
      setShouldDisplayAddButton(false);
      setCategory(undefined);
      setGranularity(isInCpom ? undefined : Granularity.STRUCTURE);
      setNom(undefined);
    }
  }, [key, isInCpom]);

  useEffect(() => {
    if (key) {
      if (category === "AUTRE_FINANCIER") {
        setShouldDisplayNomInput(true);
      } else {
        setShouldDisplayNomInput(false);
      }
      if (category && category !== "AUTRE_FINANCIER") {
        setShouldDisplayGranularitySelect(true);
      } else {
        setShouldDisplayGranularitySelect(false);
      }
    } else {
      setShouldDisplayNomInput(false);
    }
  }, [key, category]);

  useEffect(() => {
    if (key && category) {
      if (category === "AUTRE_FINANCIER") {
        setShouldEnableAddButton(true);
      } else {
        if (granularity) {
          setShouldEnableAddButton(true);
        } else {
          setShouldEnableAddButton(false);
        }
      }
    } else {
      setShouldEnableAddButton(false);
    }
  }, [key, category, granularity, nom]);

  const handleAddDocument = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const index = documentsFinanciers.findIndex((documentFinancier) => {
        return (
          documentFinancier.date?.substring(0, 4) === year.toString() &&
          documentFinancier.category === category &&
          documentFinancier.granularity === granularity
        );
      });
      if (index !== -1 && category !== "AUTRE_FINANCIER") {
        remove(index);
      }

      append({
        key,
        category,
        granularity,
        nom,
        date: new Date(year, 0, 1, 13).toISOString(),
      });

      setKey(undefined);
      setCategory(undefined);
      setGranularity(undefined);
      setNom(undefined);
      setDropZoneKey(uuidv4());
    },
    [append, key, category, granularity, nom, year, documentsFinanciers, remove]
  );

  const handleFileChange = useCallback(
    ({ key }: { key?: string }) => {
      setKey(key);
    },
    [setKey]
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <DropZone
        onChange={handleFileChange}
        className="max-h-[30rem]"
        key={dropZoneKey}
      >
        {shouldDisplayCategorySelect && (
          <Select
            label="Type de document"
            className="w-80"
            nativeSelectProps={{
              onChange: (e) => {
                setCategory(
                  e.target.value as DocumentFinancierCategoryType[number]
                );
              },
              value: category ?? "",
            }}
          >
            <option value="">Sélectionnez une option</option>
            {documentTypes.map((document) => (
              <option key={document.value} value={document.value}>
                {document.label}
              </option>
            ))}
          </Select>
        )}
        {shouldDisplayGranularitySelect && isInCpom && (
          <Select
            label="Échelle"
            className="w-80"
            nativeSelectProps={{
              onChange: (e) => {
                setGranularity(e.target.value as Granularity);
              },
              value: granularity ?? "",
            }}
          >
            <option value="">Sélectionnez une option</option>
            {granularities.map((granularity) => (
              <option key={granularity.value} value={granularity.value}>
                {granularity.label}
              </option>
            ))}
          </Select>
        )}
        {shouldDisplayNomInput && (
          <Input
            label="Nom du document"
            className="w-80"
            nativeInputProps={{
              onChange: (e) => {
                setNom(e.target.value);
              },
              value: nom ?? "",
            }}
          />
        )}
        {shouldDisplayAddButton && (
          <Button
            disabled={!shouldEnableAddButton}
            priority="secondary"
            onClick={handleAddDocument}
          >
            Ajouter le document
          </Button>
        )}
      </DropZone>
      <a
        target="_blank"
        className="text-default-grey text-sm underline"
        rel="noopener noreferrer"
        href="https://stirling-pdf.framalab.org/compress-pdf?lang=fr_FR"
      >
        Mon fichier est trop lourd
      </a>
    </div>
  );
};

type Props = {
  year: number;
  index: number;
  isAutorisee: boolean;
  control: Control<DocumentsFinanciersFlexibleFormValues>;
};
