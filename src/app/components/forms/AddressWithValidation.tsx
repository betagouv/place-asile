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
import {
  Autocomplete,
  useAutocomplete,
  AutocompleteSuggestion,
} from "./Autocomplete";

export default function AddressWithValidation<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  fullAddressName,
  zipCodeName,
  streetName,
  cityName,
  countyName,
  latName,
  longName,
  required = false,
  disabled = false,
  className,
  label,
}: AddressWithValidationProps<TFieldValues>) {
  // Use the form context if control is not provided
  const finalControl = control;

  // Controller for full address (visible field)
  const { field: fullAddressField, fieldState: fullAddressFieldState } =
    useController({
      name: fullAddressName as Path<TFieldValues>,
      control: finalControl,
      rules: {
        required,
      },
    });

  // Controllers for hidden fields - simplified to avoid unnecessary renders
  const zipCodeFieldResult = useController({
    name: zipCodeName as Path<TFieldValues>,
    control: finalControl,
    rules: { required },
  });

  const streetFieldResult = useController({
    name: streetName as Path<TFieldValues>,
    control: finalControl,
    rules: { required },
  });

  const cityFieldResult = useController({
    name: cityName as Path<TFieldValues>,
    control: finalControl,
    rules: { required },
  });

  const countyFieldResult = useController({
    name: countyName as Path<TFieldValues>,
    control: finalControl,
    rules: { required },
  });

  const latFieldResult = useController({
    name: (latName || "_lat") as Path<TFieldValues>,
    control: finalControl,
  });

  const longFieldResult = useController({
    name: (longName || "_long") as Path<TFieldValues>,
    control: finalControl,
  });

  // Function to fetch address suggestions from the API
  const fetchAddressSuggestions = React.useCallback(
    async (query: string): Promise<AddressSuggestion[]> => {
      if (!query || query.length < 3) {
        return [];
      }

      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();

      if (data && data.features) {
        return data.features.map(
          (feature: AddressFeature): AddressSuggestion => {
            const { properties, geometry } = feature;
            const [x, y] = geometry.coordinates;

            return {
              ...properties,
              x,
              y,
              key:
                properties.id || `${properties.label}-${properties.postcode}`,
            };
          }
        );
      }
      return [];
    },
    []
  );

  // Use the autocomplete hook
  const {
    suggestions,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    handleInputChange,
    resetSuggestions,
    autocompleteRef,
  } = useAutocomplete<AddressSuggestion>(fetchAddressSuggestions);

  // Handle input change with debounce
  const handleFullAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    fullAddressField.onChange(value);
    handleInputChange(value);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (
    suggestion: AutocompleteSuggestion | null
  ) => {
    if (!suggestion) {
      // This is a click outside event
      setShowSuggestions(false);
      return;
    }

    // Cast the suggestion to AddressSuggestion since we know it's coming from our data
    const addressSuggestion = suggestion as AddressSuggestion;

    // Update full address field
    fullAddressField.onChange(addressSuggestion.label);

    // Update zip code
    if (addressSuggestion.postcode && zipCodeName) {
      zipCodeFieldResult.field.onChange(addressSuggestion.postcode);
    }

    // Update street name
    if (streetName) {
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

    // Update city
    if (addressSuggestion.city && cityName) {
      cityFieldResult.field.onChange(addressSuggestion.city);
    }

    // Update county (département) from context
    if (addressSuggestion.context && countyName) {
      // Context format is typically: "75, Paris, Île-de-France"
      // We want to extract the department (county)
      const contextParts = addressSuggestion.context.split(",");
      if (contextParts.length > 0) {
        const county = contextParts[0].trim();
        countyFieldResult.field.onChange(county);
      }
    }

    // Update coordinates (lat/long)
    if (addressSuggestion.y && latName) {
      latFieldResult.field.onChange(addressSuggestion.y.toString());
    }

    if (addressSuggestion.x && longName) {
      longFieldResult.field.onChange(addressSuggestion.x.toString());
    }

    // Hide suggestions
    resetSuggestions();
  };

  return (
    <div className={className}>
      {/* Full Address Input with Autocomplete */}
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

        {/* Autocomplete component */}
        <Autocomplete
          ref={autocompleteRef}
          suggestions={suggestions}
          isLoading={isLoading}
          showSuggestions={showSuggestions}
          onSelect={handleSelectSuggestion}
          listClassName="max-h-60"
        />
      </div>

      {/* Hidden inputs for Zod validation */}
      <div>
        {zipCodeName && (
          <input
            {...zipCodeFieldResult.field}
            data-testid="zipCode-input"
            aria-hidden="true"
            type="hidden"
          />
        )}
        {streetName && (
          <input
            {...streetFieldResult.field}
            data-testid="street-input"
            aria-hidden="true"
            type="hidden"
          />
        )}
        {cityName && (
          <input
            {...cityFieldResult.field}
            data-testid="city-input"
            aria-hidden="true"
            type="hidden"
          />
        )}
        {countyName && (
          <input
            {...countyFieldResult.field}
            data-testid="county-input"
            aria-hidden="true"
            type="hidden"
          />
        )}
        {latName && (
          <input
            {...latFieldResult.field}
            data-testid="lat-input"
            aria-hidden="true"
            type="hidden"
          />
        )}
        {longName && (
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

// Define the type for address suggestions from the API
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

// Define the type for the API response feature
type AddressFeature = {
  properties: {
    label: string;
    score: number;
    housenumber?: string;
    street?: string;
    postcode?: string;
    city?: string;
    context?: string;
    type?: string;
    importance?: number;
    name?: string;
    id?: string;
  };
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
};

type AddressWithValidationProps<
  TFieldValues extends FieldValues = FieldValues
> = Partial<UseControllerProps<TFieldValues>> & {
  // Field names
  fullAddressName: string;
  zipCodeName?: string;
  streetName?: string;
  cityName?: string;
  countyName?: string;
  latName?: string;
  longName?: string;

  // Display props
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;

  // Form integration
  control?: Control<TFieldValues>;
};
