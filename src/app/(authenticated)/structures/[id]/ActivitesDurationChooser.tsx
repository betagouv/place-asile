import { ReactElement, useState } from "react";
import {
  SegmentedControl,
  SegmentedControlProps,
} from "@codegouvfr/react-dsfr/SegmentedControl";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { getLastMonths, getMonthsBetween } from "@/app/utils/date.util";

export const ActivitesDurationChooser = ({
  setSelectedMonths,
  debutConvention,
  finConvention,
}: Props): ReactElement => {
  const [selectedDuration, setSelectedDuration] = useState("6months");
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [customEndDate, setCustomEndDate] = useState<string | null>(null);

  const getSelectedMonths = (selectedDuration: string): string[] => {
    const selectedMonths: Record<string, string[]> = {
      convention: getMonthsBetween(debutConvention, finConvention),
      "6months": getLastMonths(6),
      "12months": getLastMonths(12),
      "24months": getLastMonths(24),
      custom: getMonthsBetween(customStartDate, customEndDate),
    };
    return selectedMonths[selectedDuration];
  };

  const handleDurationSelection = (selectedDuration: string) => {
    setSelectedDuration(selectedDuration);
    const selectedMonths = getSelectedMonths(selectedDuration);
    setSelectedMonths(selectedMonths);
  };

  const durations: SegmentedControlProps.Segments = [
    {
      label: "Convention",
      nativeInputProps: {
        value: "convention",
        checked: selectedDuration === "convention",
        onChange: () => handleDurationSelection("convention"),
      },
    },
    {
      label: "6 mois",
      nativeInputProps: {
        value: "6months",
        checked: selectedDuration === "6months",
        onChange: () => handleDurationSelection("6months"),
      },
    },
    {
      label: "12 mois",
      nativeInputProps: {
        value: "12months",
        checked: selectedDuration === "12months",
        onChange: () => handleDurationSelection("12months"),
      },
    },
    {
      label: "24 mois",
      nativeInputProps: {
        value: "24months",
        checked: selectedDuration === "24months",
        onChange: () => handleDurationSelection("24months"),
      },
    },
    {
      label: "Autre",
      nativeInputProps: {
        value: "custom",
        checked: selectedDuration === "custom",
        onChange: () => handleDurationSelection("custom"),
      },
    },
  ];

  return (
    <div className="flex items-end">
      <div className="pr-2">
        <SegmentedControl segments={durations} hideLegend={true} />
      </div>
      {selectedDuration === "custom" && (
        <div className="pr-2">
          <Input
            label="Date de début"
            nativeInputProps={{
              type: "date",
              onChange: (event) => {
                setCustomStartDate(event.target.value);
                handleDurationSelection("custom");
              },
            }}
          />
        </div>
      )}
      {selectedDuration === "custom" && (
        <Input
          label="Date de fin"
          nativeInputProps={{
            type: "date",
            onChange: (event) => {
              setCustomEndDate(event.target.value);
              handleDurationSelection("custom");
            },
          }}
        />
      )}
    </div>
  );
};

type Props = {
  setSelectedMonths: (selectedMonths: string[]) => void;
  debutConvention: Date | null;
  finConvention: Date | null;
};
