import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { useRef, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

import { Table } from "@/app/components/common/Table";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useYearRange } from "@/app/hooks/useYearRange";
import { cn } from "@/app/utils/classname.util";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";

import { useStructureContext } from "../../../context/StructureClientContext";

const modal = createModal({
  id: "commentaire-modal",
  isOpenedByDefault: false,
});

export const DetailAffectationTable = ({
  sliceYears = 3,
}: DetailAffectationTableProps) => {
  const { years } = useYearRange();
  const { structure } = useStructureContext();
  const yearsToDisplay = years.slice(-sliceYears);

  const hasCpom = structure?.cpom;
  const isAutorisee = isStructureAutorisee(structure?.type);
  const isSubventionnee = isStructureSubventionnee(structure?.type);

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

  // TODO : Mettre la logique de modal dans un autre composant
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);
  const [currentCommentDate, setCurrentCommentDate] = useState<Date>(
    new Date()
  );
  const inputModalRef = useRef<HTMLTextAreaElement>(null);

  const handleOpenModal = (index: number, currentCommentDate: Date) => {
    setCurrentCommentIndex(index);
    setCurrentCommentDate(currentCommentDate);

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
        stickLastColumn
        headings={[
          "Année",
          "Total",
          <th scope="col" key="reserveInvestissement">
            RÉSERVE DÉDIÉE À <br /> L’INVESTISSEMENT <br />
          </th>,
          <th scope="col" key="chargesNonReconductibles">
            CHARGES NON <br /> RECONDUCTIBLES <br />
          </th>,
          <th scope="col" key="reserveCompensationDeficits">
            RÉSERVE DE <br />
            COMPENSATION DES DÉFICITS{" "}
          </th>,
          <th scope="col" key="reserveCouvertureBFR">
            RÉSERVE DE <br />
            COUVERTURE <br />
            DE BFR
          </th>,
          <th scope="col" key="reserveCompensationAmortis">
            RÉSERVE DE <br />
            COMPENSATION DES <br />
            AMORTIS.
          </th>,

          <th
            scope="col"
            key="fondsDedies"
            className={cn(Boolean(structure?.cpom) ? "" : "hidden")}
          >
            FONDS
            <br />
            DÉDIÉS{" "}
          </th>,
          <th
            scope="col"
            key="reportANouveau"
            className={cn(
              isAutorisee || (isSubventionnee && hasCpom) ? "" : "hidden"
            )}
            aria-hidden={!(isAutorisee || (isSubventionnee && hasCpom))}
          >
            Report à nouveau
          </th>,
          <th
            scope="col"
            key="autre"
            className={cn(
              isAutorisee || (isSubventionnee && hasCpom) ? "" : "hidden"
            )}
            aria-hidden={!(isAutorisee || (isSubventionnee && hasCpom))}
          >
            <Tooltip title="Précisez dans 'Commentaire'">
              Autre{" "}
              <i className="fr-icon-information-line before:scale-50 before:origin-left" />
            </Tooltip>
          </th>,
          <th scope="col" key="commentaire">
            Commentaire
          </th>,
        ]}
        enableBorders
      >
        {yearsToDisplay.map((year, index) => {
          const fieldIndex = years.length - sliceYears + index;

          const totalValue =
            budgets?.[fieldIndex]?.affectationReservesFondsDedies || 0;

          const isEditable = totalValue > 0;

          return (
            <tr key={year}>
              <td>
                {year}
                <input
                  type="hidden"
                  {...register(`budgets.${fieldIndex}.date`)}
                  value={`${year}-01-01T13:00:00.000Z`}
                />
              </td>
              <td className="whitespace-nowrap">{totalValue} €</td>
              <td className="w-34">
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.reserveInvestissement`}
                    id={`detailAffectation.${fieldIndex}.reserveInvestissement`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                    disabled={!isEditable}
                  />
                  &nbsp;€
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.chargesNonReconductibles`}
                    id={`detailAffectation.${fieldIndex}.chargesNonReconductibles`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                    disabled={!isEditable}
                  />
                  &nbsp;€
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.reserveCompensationDeficits`}
                    id={`detailAffectation.${fieldIndex}.reserveCompensationDeficits`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                    disabled={!isEditable}
                  />
                  &nbsp;€
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.reserveCompensationBFR`}
                    id={`detailAffectation.${fieldIndex}.reserveCompensationBFR`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                    disabled={!isEditable}
                  />
                  &nbsp;€
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.reserveCompensationAmortissements`}
                    id={`detailAffectation.${fieldIndex}.reserveCompensationAmortissements`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                    disabled={!isEditable}
                  />
                  &nbsp;€
                </div>
              </td>
              {structure?.cpom && (
                <td>
                  <div className="flex items-center gap-2">
                    <InputWithValidation
                      name={`budgets.${fieldIndex}.fondsDedies`}
                      id={`detailAffectation.${fieldIndex}.fondsDedies`}
                      control={control}
                      type="number"
                      min={0}
                      label=""
                      className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full [&_input]:min-w-[80px]"
                      variant="simple"
                      disabled={!isEditable}
                    />
                    &nbsp;€
                  </div>
                </td>
              )}

              {(isAutorisee || (isSubventionnee && hasCpom)) && (
                <>
                  <td>
                    <div className="flex items-center gap-2">
                      <InputWithValidation
                        name={`budgets.${fieldIndex}.reportANouveau`}
                        id={`detailAffectation.${fieldIndex}.reportANouveau`}
                        control={control}
                        type="number"
                        min={0}
                        label=""
                        className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full [&_input]:min-w-[80px]"
                        variant="simple"
                        disabled={!isEditable}
                      />
                      &nbsp;€
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <InputWithValidation
                        name={`budgets.${fieldIndex}.autre`}
                        id={`detailAffectation.${fieldIndex}.autre`}
                        control={control}
                        type="number"
                        min={0}
                        label=""
                        className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full [&_input]:min-w-[80px]"
                        variant="simple"
                        disabled={!isEditable}
                      />
                      &nbsp;€
                    </div>
                  </td>
                </>
              )}

              <td>
                <Button
                  type="button"
                  iconId="fr-icon-edit-box-line"
                  onClick={() => {
                    handleOpenModal(fieldIndex, budgets[fieldIndex].date);
                  }}
                  priority="tertiary no outline"
                  disabled={!isEditable}
                >
                  {budgets[fieldIndex].commentaire ? "Modifier" : "Ajouter"}
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
        title={
          inputModalRef.current?.value
            ? "Modifier un commentaire"
            : "Ajouter un commentaire"
        }
        size="large"
        buttons={[
          {
            doClosesModal: true,
            children: "Annuler",
            type: "button",
          },
          {
            doClosesModal: false,
            children: inputModalRef.current?.value ? "Modifier" : "Ajouter",
            type: "button",
            onClick: handleSaveModal,
          },
        ]}
      >
        <p className="font-bold text-xl">
          Détail affectation réserves et provisions du CPOM — Année{" "}
          {new Date(currentCommentDate).getFullYear()}
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
