import { within, render, screen } from "@testing-library/react";
import { CentresTable } from "../../../src/app/(authenticated)/centres/CentresTable";
import { LatLngTuple } from "leaflet";

describe("CentresTable", () => {
  it("should show table headings and content elements when rendered", () => {
    // GIVEN
    const centres = [
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
    render(<CentresTable centres={centres} ariaLabelledBy={ariaLabelledBy} />);

    // THEN
    const rows = screen.getAllByRole("rowgroup");
    const columnHeaders = within(rows[0]).getAllByRole("columnheader");
    expect(columnHeaders[0]).toHaveAccessibleName("Type");
    expect(columnHeaders[1]).toHaveAccessibleName("Opérateur");
    expect(columnHeaders[2]).toHaveAccessibleName("Adresse administrative");
    expect(columnHeaders[3]).toHaveAccessibleName("Répartition");
    expect(columnHeaders[4]).toHaveAccessibleName("Places");
    expect(columnHeaders[5]).toHaveAccessibleName("Détails");
    const centresRows = screen.getAllByRole("row");
    const firstCentreCells = within(centresRows[1]).getAllByRole("cell");
    expect(firstCentreCells[0]).toHaveAccessibleName("CADA");
    expect(firstCentreCells[1]).toHaveAccessibleName("Adoma");
    expect(firstCentreCells[2]).toHaveAccessibleName(
      "1, avenue de la République, 75011 Paris"
    );
    expect(firstCentreCells[3]).toHaveAccessibleName("Diffus");
    expect(firstCentreCells[4]).toHaveAccessibleName("5");
    expect(firstCentreCells[5]).toHaveAccessibleName(
      "Détails de 1, avenue de la République"
    );
    const secondCentreCells = within(centresRows[2]).getAllByRole("cell");
    expect(secondCentreCells[0]).toHaveAccessibleName("CAES");
    expect(secondCentreCells[1]).toHaveAccessibleName("Adoma");
    expect(secondCentreCells[2]).toHaveAccessibleName(
      "2, avenue de la République, 75011 Paris"
    );
    expect(secondCentreCells[3]).toHaveAccessibleName("Collectif");
    expect(secondCentreCells[4]).toHaveAccessibleName("3");
    expect(secondCentreCells[5]).toHaveAccessibleName(
      "Détails de 2, avenue de la République"
    );
    const thirdCentreCells = within(centresRows[3]).getAllByRole("cell");
    expect(thirdCentreCells[0]).toHaveAccessibleName("HUDA");
    expect(thirdCentreCells[1]).toHaveAccessibleName("CDS");
    expect(thirdCentreCells[2]).toHaveAccessibleName(
      "3, avenue de la République, 75011 Paris"
    );
    expect(thirdCentreCells[3]).toHaveAccessibleName("Collectif");
    expect(thirdCentreCells[4]).toHaveAccessibleName("2");
    expect(thirdCentreCells[5]).toHaveAccessibleName(
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
