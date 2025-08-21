import { ReactElement, useEffect, useState } from "react";
import { Autocomplete } from "./Autocomplete";
import { useOperateurSuggestion } from "@/app/hooks/useOperateurSuggestion";
import {
  AutocompleteSuggestion,
  useAutocomplete,
} from "@/app/hooks/useAutocomplete";
import Input from "@codegouvfr/react-dsfr/Input";
import { useController, useFormContext } from "react-hook-form";

export const OperateurAutocomplete = (): ReactElement => {
  const { setValue, control } = useFormContext();
  const finalControl = control;

  const operateurSuggestions = useOperateurSuggestion();
  const [manualError, setManualError] = useState<string | undefined>(undefined);
  const [hasSelected, setHasSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { field: operateurNameField, fieldState: operateurFieldState } =
    useController({
      // TODO : renommer en operateur.name
      name: "newOperateur.name",
      control: finalControl,
      rules: {
        required: true,
      },
    });

  const operateurIdFieldResult = useController({
    // TODO : renommer en operateur.id
    name: "newOperateur.id",
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
  } = useAutocomplete<OperateurSuggestion>(operateurSuggestions);

  const handleSelectSuggestion = (
    suggestion: AutocompleteSuggestion | null
  ) => {
    if (!suggestion) {
      resetSuggestions();
      return;
    }

    setHasSelected(true);
    setManualError(undefined);
    const operateurSuggestion = suggestion as OperateurSuggestion;

    setValue("newOperateur.id", operateurSuggestion.id);
    setValue("newOperateur.name", operateurSuggestion.label);
    setShowSuggestions(false);
  };

  const handleOperateurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    operateurNameField.onChange(value);
    handleInputChange(value);

    setHasInteracted(true);

    if (value) {
      setHasSelected(false);
    }

    setShowSuggestions(true);
  };

  const handleBlur = () => {
    operateurNameField.onBlur();
    setIsFocused(false);
    if (hasInteracted && !hasSelected && operateurNameField.value) {
      setManualError(
        "Veuillez sélectionner un opérateur dans la liste déroulante"
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
      operateurNameField.value
    ) {
      setManualError(
        "Veuillez sélectionner un opérateur dans la liste déroulante"
      );
    } else if (!operateurNameField.value || hasSelected) {
      setManualError(undefined);
    }
  }, [isFocused, hasInteracted, hasSelected, operateurNameField.value]);

  return (
    <div className="relative">
      <Input
        nativeInputProps={{
          ...operateurNameField,
          // TODO : renommer l'id en operateur
          id: "newOperateur",
          onChange: handleOperateurChange,
          value: operateurNameField.value || "",
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
        label="Opérateur"
        state={operateurFieldState.invalid || manualError ? "error" : "default"}
        stateRelatedMessage={operateurFieldState.error?.message || manualError}
      />

      <Autocomplete
        suggestions={suggestions}
        isLoading={isLoading}
        showSuggestions={showSuggestions}
        onSelect={handleSelectSuggestion}
        listClassName="max-h-60"
        className="top-18"
        emptyMessage="Continuez à saisir le nom de l'opérateur"
      />
      <input
        aria-hidden="true"
        type="hidden"
        {...operateurIdFieldResult.field}
      />
    </div>
  );
};

type OperateurSuggestion = AutocompleteSuggestion & {
  name: string;
};
