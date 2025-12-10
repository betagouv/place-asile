import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { createModal } from "@codegouvfr/react-dsfr/Modal/Modal";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { useRef, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

import { Table } from "@/app/components/common/Table";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { getYearFromDate, getYearRange } from "@/app/utils/date.util";

const modal = createModal({
  id: "commentaire-modal",
  isOpenedByDefault: false,
});

export const StructureSubventionneeSansCpom = () => {
  const parentFormContext = useFormContext();

  const localForm = useForm();
  const { control, formState, register, setValue, watch } =
    parentFormContext || localForm;
  const errors = formState.errors;
  const { years } = getYearRange();
  const sliceYears = 3;
  const yearsToDisplay = years.slice(-sliceYears);

  const hasErrors =
    Array.isArray(errors.budgets) &&
    errors.budgets.some(
      (budgetItemErrors: Record<string, unknown>) =>
        budgetItemErrors?.dotationDemandee ||
        budgetItemErrors?.dotationAccordee ||
        budgetItemErrors?.totalProduits ||
        budgetItemErrors?.totalCharges ||
        budgetItemErrors?.repriseEtat ||
        budgetItemErrors?.excedentRecupere ||
        budgetItemErrors?.excedentDeduit ||
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
    if (currentCommentIndex !== null && currentCommentIndex !== undefined) {
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
        ariaLabelledBy="gestionBudgetaire"
        hasErrors={hasErrors}
        preHeadings={[
          <th scope="col" key="annee" className="!border-r-1">
            {" "}
          </th>,
          <th
            scope="col"
            colSpan={2}
            key="budgetExecutoire"
            className="!border-r-3"
          >
            demande subvention de la structure
          </th>,
          <th scope="col" colSpan={7} key="compteAdministratif">
            Compte-rendu financier de la structure
          </th>,
        ]}
        headings={[
          <th scope="col" key="annee" className="!border-r-1">
            Année
          </th>,
          <th scope="col" key="dotationDemandee">
            Dotation <br /> demandée
          </th>,
          <th scope="col" key="dotationAccordee" className="!border-r-3">
            Dotation <br />
            accordée
          </th>,
          <th scope="col" key="totalProduitsDotationEtat">
            Total produits <br />
            <small>dont dotation État</small>
          </th>,
          <th scope="col" key="totalChargesRetenues" className="!border-r-1">
            Total charges <small>retenues</small>
          </th>,
          <th scope="col" key="deficitCompenséParEtat">
            Déficit compensé <small>par état</small>
          </th>,
          <th
            scope="col"
            key="excedentRecupereTitreDeRecette"
            className="!border-r-1"
          >
            excédent récupéré <small>titre de recette</small>
          </th>,
          <th
            scope="col"
            key="excedentDéduitDotationAVenir"
            className="!border-r-1"
          >
            <Tooltip
              title={
                <>
                  <span>Montant qui sera déduit</span>
                  <br />
                  <span> de la dotation pour l’année n+2</span>
                </>
              }
            >
              À réemployer dans dotation à venir{" "}
              <i className="fr-icon-information-line before:scale-50 before:origin-left" />
            </Tooltip>
          </th>,
          <th scope="col" key="restantFondsDedies" className="!border-r-1">
            restant <small>fonds dédiés</small>
          </th>,
          <th scope="col" key="commentaire">
            commentaire
          </th>,
        ]}
        enableBorders
      >
        {yearsToDisplay.map((year, index) => {
          const fieldIndex = years.length - sliceYears + index;
          return (
            <tr key={year}>
              <td className="!border-r-1">
                {year}
                <input
                  type="hidden"
                  {...register(`budgets.${fieldIndex}.id`)}
                />
                <input
                  type="hidden"
                  value={`${year}-01-01T13:00:00.000Z`}
                  {...register(`budgets.${fieldIndex}.date`)}
                />
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.dotationDemandee`}
                    id={`gestionBudgetaire.${fieldIndex}.dotationDemandee`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                  />
                  &nbsp;€
                </div>
              </td>
              <td className="!border-r-3">
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.dotationAccordee`}
                    id={`gestionBudgetaire.${fieldIndex}.dotationAccordee`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                  />
                  &nbsp;€
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.totalProduits`}
                    id={`gestionBudgetaire.${fieldIndex}.totalProduits`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                  />
                  &nbsp;€
                </div>
              </td>
              <td className="!border-r-1">
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.totalCharges`}
                    id={`gestionBudgetaire.${fieldIndex}.totalCharges`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                  />
                  &nbsp;€
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.repriseEtat`}
                    id={`gestionBudgetaire.${fieldIndex}.repriseEtat`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                  />
                  &nbsp;€
                </div>
              </td>

              <td className="!border-r-1">
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    // TODO: fix this name with correct value in db
                    name={`budgets.${fieldIndex}.excedentRecupere`}
                    id={`gestionBudgetaire.${fieldIndex}.excedentRecupere`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                  />
                  &nbsp;€
                </div>
              </td>
              <td className="!border-r-1">
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    // TODO: fix this name with correct value in db
                    name={`budgets.${fieldIndex}.excedentDeduit`}
                    id={`gestionBudgetaire.${fieldIndex}.excedentDeduit`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                  />
                  &nbsp;€
                </div>
              </td>
              <td className="!border-r-1">
                <div className="flex items-center gap-2">
                  <InputWithValidation
                    name={`budgets.${fieldIndex}.fondsDedies`}
                    id={`gestionBudgetaire.${fieldIndex}.fondsDedies`}
                    control={control}
                    type="number"
                    min={0}
                    label=""
                    className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                    variant="simple"
                  />
                  &nbsp;€
                </div>
              </td>
              <td>
                <Button
                  type="button"
                  iconId="fr-icon-edit-box-line"
                  onClick={() => {
                    handleOpenModal(fieldIndex, budgets[fieldIndex].date);
                  }}
                  priority="tertiary no outline"
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
          budgets[currentCommentIndex]?.commentaire
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
            children: budgets[currentCommentIndex]?.commentaire
              ? "Modifier"
              : "Ajouter",
            type: "button",
            onClick: handleSaveModal,
          },
        ]}
      >
        <p className="font-bold text-xl">
          Détail — Année {getYearFromDate(currentCommentDate)}
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
