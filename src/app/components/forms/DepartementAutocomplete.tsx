import Input from "@codegouvfr/react-dsfr/Input";
import { ReactElement, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

import {
  AutocompleteSuggestion,
  useAutocomplete,
} from "@/app/hooks/useAutocomplete";
import { normalizeAccents } from "@/app/utils/string.util";
import { DEPARTEMENTS } from "@/constants";

import { Autocomplete } from "./Autocomplete";

export const DepartementAutocomplete = (): ReactElement => {
  const { setValue, control } = useFormContext();
  const finalControl = control;

  const departementSuggestions = async (
    searchTerm: string
  ): Promise<DepartementSuggestion[]> => {
    return DEPARTEMENTS.filter((departement) =>
      normalizeAccents(departement.name).includes(normalizeAccents(searchTerm))
    ).map((departement) => ({
      id: departement.numero,
      label: departement.name,
      key: departement.numero,
    }));
  };

  const [manualError, setManualError] = useState<string | undefined>(undefined);
  const [hasSelected, setHasSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { field: departementNameField, fieldState: departementFieldState } =
    useController({
      name: "departement.name",
      control: finalControl,
      rules: {
        required: true,
      },
    });

  const departementIdFieldResult = useController({
    name: "departement.id",
    control: finalControl,
    rules: { required: true },
  });

  const {
    suggestions,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    handleInputChange,
    resetSuggestions,
  } = useAutocomplete<DepartementSuggestion>(departementSuggestions);

  const handleSelectSuggestion = (
    suggestion: AutocompleteSuggestion | null
  ) => {
    if (!suggestion) {
      resetSuggestions();
      return;
    }

    setHasSelected(true);
    setManualError(undefined);
    const departementSuggestion = suggestion as DepartementSuggestion;

    setValue("departement.numero", departementSuggestion.id);
    setValue("departement.name", departementSuggestion.label);
    setShowSuggestions(false);
  };

  const handleDepartementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    departementNameField.onChange(value);
    handleInputChange(value);

    setHasInteracted(true);

    if (value) {
      setHasSelected(false);
    }

    setShowSuggestions(true);
  };

  const handleBlur = () => {
    departementNameField.onBlur();
    setIsFocused(false);
    if (hasInteracted && !hasSelected && departementNameField.value) {
      setManualError(
        "Veuillez sélectionner un département dans la liste déroulante"
      );
    } else {
      setManualError(undefined);
    }
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    setIsFocused(true);
  };

  useEffect(() => {
    if (
      !isFocused &&
      hasInteracted &&
      !hasSelected &&
      departementNameField.value
    ) {
      setManualError(
        "Veuillez sélectionner un département dans la liste déroulante"
      );
    } else if (!departementNameField.value || hasSelected) {
      setManualError(undefined);
    }
  }, [isFocused, hasInteracted, hasSelected, departementNameField.value]);

  return (
    <div className="relative">
      <Input
        nativeInputProps={{
          ...departementNameField,
          id: "departement",
          onChange: handleDepartementChange,
          value: departementNameField.value || "",
          autoComplete: "off",
          type: "text",
          onBlur: handleBlur,
          onFocus: handleFocus,
          "aria-autocomplete": "list",
          "aria-controls": "autocomplete-suggestions",
          "aria-expanded": showSuggestions && suggestions.length > 0,
          "aria-activedescendant":
            showSuggestions && suggestions.length > 0
              ? `suggestion-0`
              : undefined,
          role: "combobox",
        }}
        label="Département"
        state={
          departementFieldState.invalid || manualError ? "error" : "default"
        }
        stateRelatedMessage={
          departementFieldState.error?.message || manualError
        }
      />

      <Autocomplete
        suggestions={suggestions}
        isLoading={isLoading}
        showSuggestions={showSuggestions}
        onSelect={handleSelectSuggestion}
        listClassName="max-h-60"
        className="top-18"
        emptyMessage="Continuez à saisir le nom du département"
      />
      <input
        aria-hidden="true"
        type="hidden"
        {...departementIdFieldResult.field}
      />
    </div>
  );
};

type DepartementSuggestion = AutocompleteSuggestion & {
  id: string;
  label: string;
  key: string;
};
