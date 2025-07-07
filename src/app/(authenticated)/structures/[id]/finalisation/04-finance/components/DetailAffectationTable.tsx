import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useYearRange } from "@/app/hooks/useYearRange";
import { useFormContext, useForm } from "react-hook-form";
import { Table } from "@/app/components/common/Table";
import { useStructureContext } from "../../../context/StructureClientContext";
import { cn } from "@/app/utils/classname.util";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useRef, useState } from "react";
import Input from "@codegouvfr/react-dsfr/Input";

const modal = createModal({
  id: "commentaire-modal",
  isOpenedByDefault: false,
});

export const DetailAffectationTable = ({
  sliceYears = 2,
}: DetailAffectationTableProps) => {
  const { years } = useYearRange();
  const { structure } = useStructureContext();
  const yearsToDisplay = years.slice(-sliceYears);

  const parentFormContext = useFormContext();

  const localForm = useForm();
  const { control, formState, watch, register, setValue } =
    parentFormContext || localForm;
  const errors = formState.errors;
  const hasErrors =
    Array.isArray(errors.budgets) &&
    errors.budgets.some(
      (budgetItemErrors: Record<string, unknown>) =>
        budgetItemErrors?.reserveInvestissement ||
        budgetItemErrors?.chargesNonReconductibles ||
        budgetItemErrors?.reserveCompensationDeficits ||
        budgetItemErrors?.reserveCompensationBFR ||
        budgetItemErrors?.reserveCompensationAmortissements ||
        budgetItemErrors?.fondsDedies ||
        budgetItemErrors?.commentaire
    );

  const budgets = watch("budgets");

  // Modal & comment stuff
  const [currentCommentIndex, setCurrentCommentIndex] = useState<number>(0);
  const inputModalRef = useRef<HTMLTextAreaElement>(null);

  const handleOpenModal = (index: number) => {
    setCurrentCommentIndex(index);

    if (inputModalRef.current) {
      inputModalRef.current.value = budgets[index]?.commentaire || "";
    }

    modal.open();
  };

  const handleCloseModal = () => {
    modal.close();
  };

  const handleSaveModal = () => {
    if (currentCommentIndex) {
      setValue(
        `budgets.${currentCommentIndex}.commentaire`,
        inputModalRef.current?.value || ""
      );
      handleCloseModal();
    }
  };

  return (
    <>
      <Table
        ariaLabelledBy=""
        hasErrors={hasErrors}
        className="[&_tr]:!bg-transparent"
        headings={[
          "Année",
          "Total",
          <th scope="col" key="reserveInvestissement">
            réserve dédiée à <br /> l’investissement <br />
            <small className="font-normal">(10682)</small>
          </th>,
          <th scope="col" key="chargesNonReconductibles">
            charges non <br /> reconductibles <br />
            <small className="font-normal">(11511 ou 111)</small>
          </th>,
          <th scope="col" key="reserveCompensationDeficits">
            réserve de <br />
            compensation des <br />
            déficits <small className="font-normal">(10686)</small>
          </th>,
          <th scope="col" key="reserveCouvertureBFR">
            RÉSERVE DE <br />
            COUVERTURE <br />
            DE BFR <small className="font-normal">(10685)</small>
          </th>,
          <th scope="col" key="reserveCompensationAmortis">
            RÉSERVE DE <br />
            COMPENSATION DES <br />
            AMORTIS. <small className="font-normal">(10687)</small>
          </th>,

          <th
            scope="col"
            key="fondsDedies"
            className={cn(Boolean(structure?.cpom) ? "" : "hidden")}
          >
            fonds
            <br />
            dédiés{" "}
          </th>,
          "commentaire",
        ]}
        enableBorders
      >
        {yearsToDisplay.map((year, index) => {
          const fieldIndex = years.length - sliceYears + index;

          const currentReservesFondsDedies =
            budgets?.[fieldIndex]?.affectationReservesFondsDedies;

          const isEditable = currentReservesFondsDedies ?? false;

          let totalValue = 0;
          if (currentReservesFondsDedies) {
            totalValue = Number(currentReservesFondsDedies);
          }

          return (
            <tr key={year}>
              <td>
                {year}
                <input
                  type="hidden"
                  {...register(`budgets.${fieldIndex}.date`)}
                  value={`${year}-01-01T00:00:00.000Z`}
                />
              </td>
              <td className="whitespace-nowrap">{totalValue} €</td>
              <td className="flex items-center gap-2 w-34">
                <InputWithValidation
                  name={`budgets.${fieldIndex}.reserveInvestissement`}
                  id={`detailAffectation.${fieldIndex}.reserveInvestissement`}
                  control={control}
                  type="number"
                  min={0}
                  label=""
                  className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
                  variant="simple"
                  disabled={!isEditable}
                />{" "}
                €
              </td>
              <td>
                <InputWithValidation
                  name={`budgets.${fieldIndex}.chargesNonReconductibles`}
                  id={`detailAffectation.${fieldIndex}.chargesNonReconductibles`}
                  control={control}
                  type="number"
                  min={0}
                  label=""
                  className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
                  variant="simple"
                  disabled={!isEditable}
                />
              </td>
              <td>
                <InputWithValidation
                  name={`budgets.${fieldIndex}.reserveCompensationDeficits`}
                  id={`detailAffectation.${fieldIndex}.reserveCompensationDeficits`}
                  control={control}
                  type="number"
                  min={0}
                  label=""
                  className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
                  variant="simple"
                  disabled={!isEditable}
                />
              </td>
              <td>
                <InputWithValidation
                  name={`budgets.${fieldIndex}.reserveCompensationBFR`}
                  id={`detailAffectation.${fieldIndex}.reserveCompensationBFR`}
                  control={control}
                  type="number"
                  min={0}
                  label=""
                  className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
                  variant="simple"
                  disabled={!isEditable}
                />
              </td>
              <td>
                <InputWithValidation
                  name={`budgets.${fieldIndex}.reserveCompensationAmortissements`}
                  id={`detailAffectation.${fieldIndex}.reserveCompensationAmortissements`}
                  control={control}
                  type="number"
                  min={0}
                  label=""
                  className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
                  variant="simple"
                  disabled={!isEditable}
                />
              </td>
              {structure?.cpom && (
                <td>
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.fondsDedies`}
                    id={`detailAffectation.${fieldIndex}.fondsDedies`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
                    variant="simple"
                    disabled={!isEditable}
                  />
                </td>
              )}
              <td>
                <Button
                  type="button"
                  iconId="fr-icon-edit-box-line"
                  onClick={() => {
                    handleOpenModal(fieldIndex);
                  }}
                  priority="tertiary no outline"
                  disabled={!isEditable}
                >
                  Ajouter
                </Button>

                <input
                  type="hidden"
                  id={`detailAffectation.${fieldIndex}.commentaire`}
                  {...register(`budgets.${fieldIndex}.commentaire`)}
                />
              </td>
            </tr>
          );
        })}
      </Table>
      <modal.Component
        title={"Ajouter un commentaire"}
        size="large"
        buttons={[
          {
            doClosesModal: true,
            children: "Annuler",
            type: "button",
          },
          {
            doClosesModal: false,
            children: "Ajouter",
            type: "button",
            onClick: handleSaveModal,
          },
        ]}
      >
        <p className="font-bold text-xl">
          Détail affectation réserves et provisions du CPOM — Année{" "}
          {years[currentCommentIndex - 1]}
        </p>

        <Input
          label=""
          textArea
          nativeTextAreaProps={{
            ref: inputModalRef,
          }}
        />
      </modal.Component>
    </>
  );
};

type DetailAffectationTableProps = {
  sliceYears?: number;
};
