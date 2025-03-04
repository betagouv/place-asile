import { within, render, screen } from "@testing-library/react";
import { StructuresTable } from "../../../src/app/(authenticated)/structures/StructuresTable";
import { LatLngTuple } from "leaflet";
import { StructureAdministrative } from "@/types/structure.type";
import { createStructures } from "../../test-utils/structure.factory";

describe("StructuresTable", () => {
  it("should show table headings and content elements when rendered", () => {
    // GIVEN
    const structuresAdministratives: StructureAdministrative[] = [
      {
        id: 1,
        operateur: "Adoma",
        type: "CADA",
        typologie: "Diffus",
        coordinates: [48.8670239, 2.3612011] as LatLngTuple,
        adresseOperateur: "123, avenue de la République, 75011 Paris",
        attachedStructures: createStructures({
          adresseOperateur: "123, avenue de la République, 75011 Paris",
        }),
      },
      {
        id: 2,
        operateur: "Adoma",
        type: "CAES",
        typologie: "Collectif",
        coordinates: [48.8670239, 2.3612011] as LatLngTuple,
        adresseOperateur: "124, avenue de la République, 75011 Paris",
        attachedStructures: createStructures({
          adresseOperateur: "124, avenue de la République, 75011 Paris",
        }),
      },
      {
        id: 3,
        operateur: "CDS",
        type: "HUDA",
        typologie: "Collectif",
        coordinates: [48.8670239, 2.3612011] as LatLngTuple,
        adresseOperateur: "125, avenue de la République, 75011 Paris",
        attachedStructures: createStructures({
          adresseOperateur: "125, avenue de la République, 75011 Paris",
        }),
      },
    ];
    const ariaLabelledBy = "";

    // WHEN
    render(
      <StructuresTable
        structures={structuresAdministratives}
        ariaLabelledBy={ariaLabelledBy}
      />
    );

    // THEN
    const rows = screen.getAllByRole("rowgroup");
    const columnHeaders = within(rows[0]).getAllByRole("columnheader");
    expect(columnHeaders[0]).toHaveAccessibleName("Type");
    expect(columnHeaders[1]).toHaveAccessibleName("Opérateur");
    expect(columnHeaders[2]).toHaveAccessibleName("Places");
    expect(columnHeaders[3]).toHaveAccessibleName("Répartition");
    expect(columnHeaders[4]).toHaveAccessibleName("Commune");
    expect(columnHeaders[5]).toHaveAccessibleName("Détails");
    const structureRows = screen.getAllByRole("row");
    const firstStructureCells = within(structureRows[1]).getAllByRole("cell");
    expect(firstStructureCells[0]).toHaveAccessibleName("CADA");
    expect(firstStructureCells[1]).toHaveAccessibleName("Adoma");
    expect(firstStructureCells[2]).toHaveAccessibleName("10");
    expect(firstStructureCells[3]).toHaveAccessibleName("Diffus");
    expect(firstStructureCells[4]).toHaveAccessibleName("Paris + 5 autres");
    expect(firstStructureCells[5]).toHaveAccessibleName(
      "Détails de la structure 1"
    );
    const secondStructureCells = within(structureRows[2]).getAllByRole("cell");
    expect(secondStructureCells[0]).toHaveAccessibleName("CAES");
    expect(secondStructureCells[1]).toHaveAccessibleName("Adoma");
    expect(secondStructureCells[2]).toHaveAccessibleName("10");
    expect(secondStructureCells[3]).toHaveAccessibleName("Collectif");
    expect(secondStructureCells[4]).toHaveAccessibleName("Paris + 5 autres");
    expect(secondStructureCells[5]).toHaveAccessibleName(
      "Détails de la structure 2"
    );
    const thirdStructureCells = within(structureRows[3]).getAllByRole("cell");
    expect(thirdStructureCells[0]).toHaveAccessibleName("HUDA");
    expect(thirdStructureCells[1]).toHaveAccessibleName("CDS");
    expect(thirdStructureCells[2]).toHaveAccessibleName("10");
    expect(thirdStructureCells[3]).toHaveAccessibleName("Collectif");
    expect(thirdStructureCells[4]).toHaveAccessibleName("Paris + 5 autres");
    expect(thirdStructureCells[5]).toHaveAccessibleName(
      "Détails de la structure 3"
    );
    const pagination = screen.getByRole("navigation");
    const pages = within(pagination).getAllByRole("link");
    expect(pages[0]).toHaveAccessibleName("Première page");
    expect(pages[1]).toHaveAccessibleName("Page précédente");
    expect(pages[2]).toHaveAccessibleName("Page 1/1");
    expect(pages[3]).toHaveAccessibleName("Page suivante");
    expect(pages[4]).toHaveAccessibleName("Dernière page");
  });
});
