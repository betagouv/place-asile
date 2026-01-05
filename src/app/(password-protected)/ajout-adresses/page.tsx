import Button from "@codegouvfr/react-dsfr/Button";
import { ReactElement } from "react";

export default async function AjoutStructurePage(): Promise<ReactElement> {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      <h2 className="flex flex-col items-center gap-4 text-center text-xl font-bold mb-2 text-title-blue-france">
        <i className="fr-icon-draft-line text-action-high-blue-france text-4xl [&::before]:[--icon-size:5rem]"></i>
        Formulaire d’ajout des adresses de votre structure
      </h2>
      <p className="text-center mb-10">
        Un problème technique a empêché l’enregistrement des adresses lors de la
        création de votre structure. Nous nous excusons pour la gène
        occasionnée.
        <br />
        <br />
        Ce formulaire permet de les renseigner à nouveau.
        <br />
        Si vous utilisez le même poste et le même navigateur que lors de la
        création initiale, les adresses précédemment saisies seront
        automatiquement récupérées et une simple validation suffira pour les
        enregistrer.
        <br />
      </p>
      <div className="bg-white rounded-lg p-6 max-w-xl mb-10">
        <h3 className="text-base font-bold mb-4 text-title-blue-france text-center">
          Conditions pour le préremplissage automatique
        </h3>
        <ul className="p-0">
          <li className="flex items-start gap-2 mb-3">
            <i className="fr-icon-check-line text-action-high-blue-france text-sm [&::before]:[--icon-size:1.5rem]"></i>
            Utiliser le même poste et le même navigateur que lors de la création
            de la structure.
          </li>
          <li className="flex items-start gap-2 mb-3">
            <i className="fr-icon-check-line text-action-high-blue-france text-sm [&::before]:[--icon-size:1.5rem]"></i>
            Ne pas être en navigation privée.
          </li>
          <li className="flex items-start gap-2 mb-3">
            <i className="fr-icon-check-line text-action-high-blue-france text-sm [&::before]:[--icon-size:1.5rem]"></i>
            Ne pas avoir vidé le stockage local du navigateur (local storage).
          </li>
        </ul>
        <p>
          Si vous ne remplissez pas ces conditions, vous pourrez saisir les
          adresses via les méthodes classiques.
        </p>
      </div>
      <Button
        size="large"
        linkProps={{
          href: `/ajout-adresses/selection`,
        }}
      >
        Je sélectionne ma structure
        <span className="inline-block ml-2 fr-icon-arrow-right-line text-white"></span>
      </Button>
    </div>
  );
}
