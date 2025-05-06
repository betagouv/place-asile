"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  Control,
  FieldValues,
  Path,
} from "react-hook-form";
import Input from "@codegouvfr/react-dsfr/Input";
import { Autocomplete } from "./Autocomplete";
import {
  useAutocomplete,
  AutocompleteSuggestion,
} from "@/app/hooks/useAutocomplete";
import { useAddressSuggestion } from "@/app/hooks/useAddressSuggestion";

export default function AddressWithValidation<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  fullAddress,
  zipCode,
  street,
  city,
  department,
  latitude,
  longitude,
  required = false,
  disabled = false,
  className,
  label,
}: AddressWithValidationProps<TFieldValues>) {
  const finalControl = control;

  const { field: fullAddressField, fieldState: fullAddressFieldState } =
    useController({
      name: fullAddress as Path<TFieldValues>,
      control: finalControl,
      rules: {
        required,
      },
    });

  const zipCodeFieldResult = useController({
    name: zipCode as Path<TFieldValues>,
    control: finalControl,
    rules: { required },
  });

  const streetFieldResult = useController({
    name: street as Path<TFieldValues>,
    control: finalControl,
    rules: { required },
  });

  const cityFieldResult = useController({
    name: city as Path<TFieldValues>,
    control: finalControl,
    rules: { required },
  });

  const departmentFieldResult = useController({
    name: department as Path<TFieldValues>,
    control: finalControl,
    rules: { required },
  });

  const latFieldResult = useController({
    name: (latitude || "_lat") as Path<TFieldValues>,
    control: finalControl,
  });

  const longFieldResult = useController({
    name: (longitude || "_long") as Path<TFieldValues>,
    control: finalControl,
  });

  const addressSuggestions = useAddressSuggestion();

  const {
    suggestions,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    handleInputChange,
    resetSuggestions,
    autocompleteRef,
  } = useAutocomplete<AddressSuggestion>(addressSuggestions);

  const handleFullAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    fullAddressField.onChange(value);
    handleInputChange(value);
  };

  const handleSelectSuggestion = (
    suggestion: AutocompleteSuggestion | null
  ) => {
    if (!suggestion) {
      setShowSuggestions(false);
      return;
    }

    const addressSuggestion = suggestion as AddressSuggestion;

    fullAddressField.onChange(addressSuggestion.label);
    if (addressSuggestion.postcode && zipCode) {
      zipCodeFieldResult.field.onChange(addressSuggestion.postcode);
    }

    if (street) {
      if (addressSuggestion.housenumber && addressSuggestion.street) {
        streetFieldResult.field.onChange(
          `${addressSuggestion.housenumber} ${addressSuggestion.street}`
        );
      } else if (addressSuggestion.street) {
        streetFieldResult.field.onChange(addressSuggestion.street);
      } else if (addressSuggestion.name) {
        streetFieldResult.field.onChange(addressSuggestion.name);
      }
    }

    if (addressSuggestion.city && city) {
      cityFieldResult.field.onChange(addressSuggestion.city);
    }
    if (addressSuggestion.context && department) {
      const contextParts = addressSuggestion.context.split(",");
      if (contextParts.length > 0) {
        const department = contextParts[0].trim();
        departmentFieldResult.field.onChange(department);
      }
    }

    if (addressSuggestion.y && latitude) {
      latFieldResult.field.onChange(addressSuggestion.y.toString());
    }

    if (addressSuggestion.x && longitude) {
      longFieldResult.field.onChange(addressSuggestion.x.toString());
    }

    resetSuggestions();
  };

  return (
    <div className={className}>
      <div className="relative">
        <Input
          nativeInputProps={{
            ...fullAddressField,
            onChange: handleFullAddressChange,
            value: fullAddressField.value || "",
            type: "text",
            onFocus: () => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            },
            "aria-autocomplete": "list",
            "aria-controls": "autocomplete-suggestions",
            "aria-expanded": showSuggestions && suggestions.length > 0,
            "aria-activedescendant":
              showSuggestions && suggestions.length > 0
                ? `suggestion-0`
                : undefined,
            role: "combobox",
          }}
          label={label || "Adresse complète"}
          disabled={disabled}
          state={fullAddressFieldState.invalid ? "error" : "default"}
          stateRelatedMessage={fullAddressFieldState.error?.message}
        />

        <Autocomplete
          ref={autocompleteRef}
          suggestions={suggestions}
          isLoading={isLoading}
          showSuggestions={showSuggestions}
          onSelect={handleSelectSuggestion}
          listClassName="max-h-60"
        />
      </div>

      <div>
        {zipCode && (
          <input
            {...zipCodeFieldResult.field}
            data-testid="zipCode-input"
            aria-hidden="true"
            type="hidden"
          />
        )}
        {street && (
          <input
            {...streetFieldResult.field}
            data-testid="street-input"
            aria-hidden="true"
            type="hidden"
          />
        )}
        {city && (
          <input
            {...cityFieldResult.field}
            data-testid="city-input"
            aria-hidden="true"
            type="hidden"
          />
        )}
        {department && (
          <input
            {...departmentFieldResult.field}
            data-testid="department-input"
            aria-hidden="true"
            type="hidden"
          />
        )}
        {latitude && (
          <input
            {...latFieldResult.field}
            data-testid="lat-input"
            aria-hidden="true"
            type="hidden"
          />
        )}
        {longitude && (
          <input
            {...longFieldResult.field}
            data-testid="long-input"
            aria-hidden="true"
            type="hidden"
          />
        )}
      </div>
    </div>
  );
}

type AddressSuggestion = AutocompleteSuggestion & {
  score: number;
  housenumber?: string;
  street?: string;
  postcode?: string;
  city?: string;
  context?: string;
  type?: string;
  x?: number;
  y?: number;
  importance?: number;
  name?: string;
};

type AddressWithValidationProps<
  TFieldValues extends FieldValues = FieldValues
> = Partial<UseControllerProps<TFieldValues>> & {
  fullAddress: string;
  zipCode?: string;
  street?: string;
  city?: string;
  department?: string;
  latitude?: string;
  longitude?: string;

  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  control?: Control<TFieldValues>;
};
