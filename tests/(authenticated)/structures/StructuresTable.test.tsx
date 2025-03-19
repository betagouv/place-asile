import { within, render, screen } from "@testing-library/react";
import { StructuresTable } from "../../../src/app/(authenticated)/structures/StructuresTable";
import { createStructure } from "../../test-utils/structure.factory";
import { Structure } from "@/types/structure.type";
import { createAdresse } from "../../test-utils/adresse.factory";

describe("StructuresTable", () => {
  it("should show table headings and content elements when rendered", () => {
    // GIVEN
    const adresse1 = createAdresse({});
    const adresse2 = createAdresse({});
    const adresse3 = createAdresse({});
    const structure1 = createStructure({});
    const structure2 = createStructure({});
    const structure3 = createStructure({});
    structure1.adresses = [adresse1];
    structure2.adresses = [adresse2];
    structure3.adresses = [adresse3];
    const structures: Structure[] = [structure1, structure2, structure3];
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
    expect(columnHeaders[0]).toHaveAccessibleName("DNA");
    expect(columnHeaders[1]).toHaveAccessibleName("Type");
    expect(columnHeaders[2]).toHaveAccessibleName("Opérateur");
    expect(columnHeaders[3]).toHaveAccessibleName("Places");
    expect(columnHeaders[4]).toHaveAccessibleName("Bâti");
    expect(columnHeaders[5]).toHaveAccessibleName("Commune");
    expect(columnHeaders[6]).toHaveAccessibleName("Convention en cours");
    expect(columnHeaders[7]).toHaveAccessibleName("Détails");
    const structureRows = screen.getAllByRole("row");
    const firstStructureCells = within(structureRows[1]).getAllByRole("cell");
    expect(firstStructureCells[0]).toHaveAccessibleName("C0001");
    expect(firstStructureCells[1]).toHaveAccessibleName("CADA");
    expect(firstStructureCells[2]).toHaveAccessibleName("Adoma");
    expect(firstStructureCells[3]).toHaveAccessibleName("5");
    expect(firstStructureCells[4]).toHaveAccessibleName("Diffus");
    expect(firstStructureCells[5]).toHaveAccessibleName("Paris + 5 autres");
    expect(firstStructureCells[6]).toHaveAccessibleName(
      "02/01/2024 - 02/01/2027"
    );
    expect(firstStructureCells[7]).toHaveAccessibleName(
      "Détails de la structure 1"
    );
    const secondStructureCells = within(structureRows[2]).getAllByRole("cell");
    expect(secondStructureCells[0]).toHaveAccessibleName("C0001");
    expect(secondStructureCells[1]).toHaveAccessibleName("CADA");
    expect(secondStructureCells[2]).toHaveAccessibleName("Adoma");
    expect(secondStructureCells[3]).toHaveAccessibleName("5");
    expect(secondStructureCells[4]).toHaveAccessibleName("Diffus");
    expect(secondStructureCells[5]).toHaveAccessibleName("Paris + 5 autres");
    expect(firstStructureCells[6]).toHaveAccessibleName(
      "02/01/2024 - 02/01/2027"
    );
    expect(secondStructureCells[7]).toHaveAccessibleName(
      "Détails de la structure 1"
    );
    const thirdStructureCells = within(structureRows[3]).getAllByRole("cell");
    expect(thirdStructureCells[0]).toHaveAccessibleName("C0001");
    expect(thirdStructureCells[1]).toHaveAccessibleName("CADA");
    expect(thirdStructureCells[2]).toHaveAccessibleName("Adoma");
    expect(thirdStructureCells[3]).toHaveAccessibleName("5");
    expect(thirdStructureCells[4]).toHaveAccessibleName("Diffus");
    expect(thirdStructureCells[5]).toHaveAccessibleName("Paris + 5 autres");
    expect(firstStructureCells[6]).toHaveAccessibleName(
      "02/01/2024 - 02/01/2027"
    );
    expect(thirdStructureCells[7]).toHaveAccessibleName(
      "Détails de la structure 1"
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
