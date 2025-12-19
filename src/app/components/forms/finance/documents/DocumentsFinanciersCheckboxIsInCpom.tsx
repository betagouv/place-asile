import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

import { useFormContext } from "@/app/context/FormContext";

export const DocumentsFinanciersCheckboxIsInCpom = ({ year, index }: Props) => {
  const confirmUncheckModal = createModal({
    id: `confirm-uncheck-cpom-modal-${index}`,
    isOpenedByDefault: false,
  });

  const { register, watch, setValue } = useFormContext();

  const fieldName = `structureMillesimes.${index}.cpom`;
  const isChecked = watch(fieldName) as boolean;
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setValue(fieldName, true);
      return;
    } else {
      e.preventDefault();
      confirmUncheckModal.open();
    }
  };

  const handleConfirmUncheck = () => {
    setValue(fieldName, false);
  };

  return (
    <>
      <Checkbox
        options={[
          {
            label: `En ${year}, cette structure faisait partie d'un CPOM et était prise en compte dans les résultats financiers de celui-ci`,
            nativeInputProps: {
              ...register(fieldName),
              checked: isChecked,
              onChange: handleCheckboxChange,
            },
          },
        ]}
        className="mb-6"
      />
      <confirmUncheckModal.Component
        title="Attention, vous êtes sur le point de supprimer les documents à l’échelle du CPOM."
        buttons={[
          {
            doClosesModal: true,
            children: "Annuler",
            type: "button",
          },
          {
            doClosesModal: true,
            children: "Confirmer",
            type: "button",
            onClick: handleConfirmUncheck,
          },
        ]}
      >
        <p>
          {index}En décochant la case affirmant que cette structure faisait
          partie d’un CPOM cette année-là, vous ne conserverez que les documents
          importé à l’échelle de la structure. Les autres documents seront
          supprimés, voulez-vous continuer ?
        </p>
      </confirmUncheckModal.Component>
    </>
  );
};

type Props = {
  year: number;
  index: number;
};
