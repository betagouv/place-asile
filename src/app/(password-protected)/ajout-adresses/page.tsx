import Button from "@codegouvfr/react-dsfr/Button";
import { ReactElement } from "react";

export default async function AjoutStructurePage(): Promise<ReactElement> {
  return (
    <div className="max-w-xl mx-auto flex flex-col items-center">
      <h2 className="flex flex-col items-center gap-4 text-center text-xl font-bold mb-2 text-title-blue-france">
        <i className="fr-icon-draft-line text-action-high-blue-france text-4xl [&::before]:[--icon-size:5rem]"></i>
        Formulaire d’ajout des adresses de votre structure
      </h2>
      <p className="text-center mb-10">
        Suite à un problème technique, les adresses que vous avez renseignées
        lors de la création de votre structure ne sont pas enregistrées.
        <br />
        <br />
        Ce formulaire vous permet de les renseigner à nouveau. Si vous utilisez
        le même poste et le même navigateur que lors de la création de votre
        structure, les adresses que vous avez renseignées seront automatiquement
        pré-remplies. Vous n’aurez plus qu’à valider le formulaire pour les
        enregistrer.
        <br />
      </p>
      <div className="bg-white rounded-lg p-6 max-w-xl mb-10">
        <h3 className="text-base font-bold mb-4 text-title-blue-france text-center">
          Pré-requis pour que le formulaire soit rempli automatiquement
        </h3>
        <ul className="p-0">
          <li className="flex items-start gap-2 mb-3">
            <i className="fr-icon-check-line text-action-high-blue-france text-sm [&::before]:[--icon-size:1.5rem]"></i>
            <span>
              Utiliser le même poste et le même navigateur que lors de la
              création de la page dédiée à votre structure.
            </span>
          </li>
          <li className="flex items-start gap-2 mb-3">
            <i className="fr-icon-check-line text-action-high-blue-france text-sm [&::before]:[--icon-size:1.5rem]"></i>
            <span>Ne pas naviguer en navigation privée.</span>
          </li>
          <li className="flex items-start gap-2 mb-3">
            <i className="fr-icon-check-line text-action-high-blue-france text-sm [&::before]:[--icon-size:1.5rem]"></i>
            <span>
              Ne pas avoir vidé en profondeur le cache de votre navigateur (le
              &quot;local storage&quot; de votre navigateur).
            </span>
          </li>
        </ul>
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
