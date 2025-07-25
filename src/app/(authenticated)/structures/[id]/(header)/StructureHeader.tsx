"use client";

import Link from "next/link";
import { ReactElement } from "react";
import { NavigationMenu } from "./NavigationMenu";
import { useStructureContext } from "../context/StructureClientContext";
import { useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "@codegouvfr/react-dsfr/Button";
import { getOperateurLabel } from "@/app/utils/structure.util";

export function StructureHeader(): ReactElement | null {
  const { structure } = useStructureContext();
  const router = useRouter();
  const structureHeaderRef = useRef<HTMLDivElement>(null);
  const structureHeaderHeight = useRef(0);

  const pathname = usePathname();
  const isRootPath = pathname === `/structures/${structure?.id}`;

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
    nbPlaces,
    nom,
    communeAdministrative,
    departementAdministratif,
  } = structure || {};

  const onEditClick = () => {
    router.push(`/structures/${structure.id}/finalisation/01-identification`);
  };

  return structure ? (
    <>
      <div className="sticky top-0 z-2 bg-lifted-grey" ref={structureHeaderRef}>
        <div className="flex border-bottom px-6 py-3 items-center">
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
                {type}, {getOperateurLabel(filiale, operateur)}, {nbPlaces}{" "}
                places
              </strong>
              <span className="pr-2">{" – "}</span>
              <span className="mb-0 text-title-grey fr-text--lg italic font-normal">
                {nom ? `${nom}, ` : ""} {communeAdministrative},{" "}
                {departementAdministratif}
              </span>
            </h3>
          </div>
          <div className="grow" />
          {/* TODO : faire un vrai lien (a11y) */}
          {isRootPath && (
            <Button
              iconId="fr-icon-edit-line"
              priority="secondary"
              size="small"
              className="h-full"
              onClick={onEditClick}
            >
              Modifier
            </Button>
          )}
        </div>
        {isRootPath ? <NavigationMenu /> : null}
      </div>
    </>
  ) : null;
}
