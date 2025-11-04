import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import InputWithValidation from "../../InputWithValidation";

export const Date303 = () => {
  const { control } = useFormContext();

  const [display303Date, setDisplay303Date] = useState(false);

  const handle303DateDisplay = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay303Date(e.target.checked);
  };

  return (
    <div>
      <Checkbox
        options={[
          {
            label:
              "La date de rattachement au programme 303 de cette structure ne correspond pas à sa date de création.",
            nativeInputProps: {
              name: "303",
              value: "false",
              onChange: handle303DateDisplay,
            },
          },
        ]}
      />
      <InputWithValidation
        name="date303"
        control={control}
        label="Date de rattachement au programme 303"
        type="date"
        disabled={!display303Date}
      />
    </div>
  );
};
