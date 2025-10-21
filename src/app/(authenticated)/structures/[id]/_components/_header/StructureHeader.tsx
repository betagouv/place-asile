"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";
import { useEffect, useRef } from "react";

import { useFetchState } from "@/app/context/FetchStateContext";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getOperateurLabel } from "@/app/utils/structure.util";
import { FetchState } from "@/types/fetch-state.type";
import { StructureState } from "@/types/structure.type";

import { useStructureContext } from "../../_context/StructureClientContext";
import { FinalisationHeader } from "./FinalisationHeader";
import { NavigationMenu } from "./NavigationMenu";

const autoSaveModal = createModal({
  id: "autosave-modal",
  isOpenedByDefault: false,
});
const finalisationSuccessModal = createModal({
  id: "finalisation-success-modal",
  isOpenedByDefault: false,
});

export function StructureHeader(): ReactElement | null {
  const { structure } = useStructureContext();

  const { handleFinalisation, isStructureReadyToFinalise } =
    useAgentFormHandling();

  const structureHeaderRef = useRef<HTMLDivElement>(null);
  const structureHeaderHeight = useRef(0);

  const pathname = usePathname();
  const isRootPath = pathname === `/structures/${structure?.id}`;
  const isFinalisationPath = pathname.startsWith(
    `/structures/${structure?.id}/finalisation`
  );

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (structureHeaderRef.current) {
        const height = structureHeaderRef.current.offsetHeight;
        structureHeaderHeight.current = height;
        document.documentElement.style.setProperty(
          "--structure-header-height",
          `${height}px`
        );
      }
    };

    updateHeaderHeight();

    window.addEventListener("resize", updateHeaderHeight);
    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const {
    type,
    filiale,
    operateur,
    structureTypologies,
    nom,
    communeAdministrative,
    departementAdministratif,
  } = structure || {};

  const { getFetchState } = useFetchState();
  const saveState = getFetchState("structure-save");

  return structure ? (
    <>
      <div className="sticky top-0 z-2 bg-lifted-grey" ref={structureHeaderRef}>
        <div className="flex border-b border-b-border-default-grey px-6 py-3 items-center">
          <Link
            className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-s-line"
            title="Retour aux structures d’hébergement"
            href="/structures"
          >
            Retour aux structures d’hébergement
          </Link>
          <div>
            <h2 className="text-title-blue-france text-xs uppercase mb-0">
              <strong className="pr-3">Structure hébergement</strong>
            </h2>
            <h3 className="text-title-blue-france fr-h6 mb-0">
              <strong className="pr-2">
                {type}, {getOperateurLabel(filiale, operateur?.name)},{" "}
                {structureTypologies?.[0].placesAutorisees} places
              </strong>
              <span className="pr-2">{" – "}</span>
              <span className="mb-0 text-title-grey fr-text--lg italic font-normal">
                {nom ? `${nom}, ` : ""} {communeAdministrative},{" "}
                {departementAdministratif}
              </span>
            </h3>
          </div>
          <div className="grow" />
          {isFinalisationPath && (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => autoSaveModal.open()}
                className="fr-btn--tertiary-no-outline"
              >
                {saveState === FetchState.LOADING && (
                  <span className="fr-icon-more-fill text-mention-grey" />
                )}
                {saveState === FetchState.ERROR && (
                  <span className="fr-icon-warning-line text-default-error" />
                )}
                {saveState === FetchState.IDLE && (
                  <span className="fr-icon-save-line text-mention-grey" />
                )}
              </Button>
              <Button
                disabled={!isStructureReadyToFinalise}
                onClick={async () => {
                  await handleFinalisation();
                  finalisationSuccessModal.open();
                }}
              >
                Finaliser la création
              </Button>
            </div>
          )}
        </div>
        {isRootPath && <NavigationMenu />}
        {isRootPath && structure.state === StructureState.A_FINALISER && (
          <FinalisationHeader />
        )}
      </div>
      <autoSaveModal.Component
        title="Votre progression est enregistrée automatiquement"
        buttons={[
          {
            doClosesModal: true,
            children: "J’ai compris",
            type: "button",
          },
        ]}
      >
        <p>
          Aucune action n’est requise de votre part pour enregistrer les données
          que vous avez saisies.
        </p>
      </autoSaveModal.Component>
      <finalisationSuccessModal.Component
        title="Vous avez terminé la création de cette structure !"
        buttons={[
          {
            doClosesModal: true,
            children: "J’ai compris",
            type: "button",
          },
        ]}
      >
        <p>
          Les données ont bien été enregistrées. Merci pour votre contribution
          qui va rendre l’outil plus précis.
        </p>
      </finalisationSuccessModal.Component>
    </>
  ) : null;
}
