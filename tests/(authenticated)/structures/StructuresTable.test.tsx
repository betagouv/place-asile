import { within, render, screen } from "@testing-library/react";
import { StructuresTable } from "../../../src/app/(authenticated)/structures/StructuresTable";
import { LatLngTuple } from "leaflet";

describe("StructuresTable", () => {
  it("should show table headings and content elements when rendered", () => {
    // GIVEN
    const structures = [
      {
        operateur: "Adoma",
        type: "CADA",
        nbPlaces: 5,
        adresseHebergement: "1, avenue de la République",
        codePostalHebergement: "75011",
        communeHebergement: "Paris",
        nbHebergements: 1,
        typologie: "Diffus",
        coordinates: [48.8670239, 2.3612011] as LatLngTuple,
        id: 1,
      },
      {
        operateur: "Adoma",
        type: "CAES",
        nbPlaces: 3,
        adresseHebergement: "2, avenue de la République",
        codePostalHebergement: "75011",
        communeHebergement: "Paris",
        nbHebergements: 2,
        typologie: "Collectif",
        coordinates: [48.8670239, 2.3612011] as LatLngTuple,
        id: 2,
      },
      {
        operateur: "CDS",
        type: "HUDA",
        nbPlaces: 2,
        adresseHebergement: "3, avenue de la République",
        codePostalHebergement: "75011",
        communeHebergement: "Paris",
        nbHebergements: 2,
        typologie: "Collectif",
        coordinates: [48.8670239, 2.3612011] as LatLngTuple,
        id: 3,
      },
    ];
    const ariaLabelledBy = "";

    // WHEN
    render(
      <StructuresTable
        structures={structures}
        ariaLabelledBy={ariaLabelledBy}
      />
    );

    // THEN
    const rows = screen.getAllByRole("rowgroup");
    const columnHeaders = within(rows[0]).getAllByRole("columnheader");
    expect(columnHeaders[0]).toHaveAccessibleName("Type");
    expect(columnHeaders[1]).toHaveAccessibleName("Opérateur");
    expect(columnHeaders[2]).toHaveAccessibleName("Adresse administrative");
    expect(columnHeaders[3]).toHaveAccessibleName("Répartition");
    expect(columnHeaders[4]).toHaveAccessibleName("Places");
    expect(columnHeaders[5]).toHaveAccessibleName("Détails");
    const structureRows = screen.getAllByRole("row");
    const firstStructureCells = within(structureRows[1]).getAllByRole("cell");
    expect(firstStructureCells[0]).toHaveAccessibleName("CADA");
    expect(firstStructureCells[1]).toHaveAccessibleName("Adoma");
    expect(firstStructureCells[2]).toHaveAccessibleName(
      "1, avenue de la République, 75011 Paris"
    );
    expect(firstStructureCells[3]).toHaveAccessibleName("Diffus");
    expect(firstStructureCells[4]).toHaveAccessibleName("5");
    expect(firstStructureCells[5]).toHaveAccessibleName(
      "Détails de 1, avenue de la République"
    );
    const secondStructureCells = within(structureRows[2]).getAllByRole("cell");
    expect(secondStructureCells[0]).toHaveAccessibleName("CAES");
    expect(secondStructureCells[1]).toHaveAccessibleName("Adoma");
    expect(secondStructureCells[2]).toHaveAccessibleName(
      "2, avenue de la République, 75011 Paris"
    );
    expect(secondStructureCells[3]).toHaveAccessibleName("Collectif");
    expect(secondStructureCells[4]).toHaveAccessibleName("3");
    expect(secondStructureCells[5]).toHaveAccessibleName(
      "Détails de 2, avenue de la République"
    );
    const thirdStructureCells = within(structureRows[3]).getAllByRole("cell");
    expect(thirdStructureCells[0]).toHaveAccessibleName("HUDA");
    expect(thirdStructureCells[1]).toHaveAccessibleName("CDS");
    expect(thirdStructureCells[2]).toHaveAccessibleName(
      "3, avenue de la République, 75011 Paris"
    );
    expect(thirdStructureCells[3]).toHaveAccessibleName("Collectif");
    expect(thirdStructureCells[4]).toHaveAccessibleName("2");
    expect(thirdStructureCells[5]).toHaveAccessibleName(
      "Détails de 3, avenue de la République"
    );
    const pagination = screen.getByRole("navigation");
    const pages = within(pagination).getAllByRole("link");
    expect(pages[0]).toHaveAccessibleName("Première page");
    expect(pages[1]).toHaveAccessibleName("Page précédente");
    expect(pages[2]).toHaveAccessibleName("1/1");
    expect(pages[3]).toHaveAccessibleName("Page suivante");
    expect(pages[4]).toHaveAccessibleName("Dernière page");
  });
});
