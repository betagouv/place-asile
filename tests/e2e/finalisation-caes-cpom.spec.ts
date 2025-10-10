import { test } from "@playwright/test";

import { CAES_AVEC_CPOM_DATA } from "./helpers/test-data";
import {
  createStructureViaApi,
  getStructureId,
} from "./helpers/structure-creator";
import { FinalisationAdressesPage } from "./helpers/page-objects/finalisation/FinalisationAdressesPage";
import { FinalisationFinancePage } from "./helpers/page-objects/finalisation/FinalisationFinancePage";
import { FinalisationIdentificationPage } from "./helpers/page-objects/finalisation/FinalisationIdentificationPage";
import { FinalisationNotesPage } from "./helpers/page-objects/finalisation/FinalisationNotesPage";
import { FinalisationQualitePage } from "./helpers/page-objects/finalisation/FinalisationQualitePage";
import { FinalisationTypePlacesPage } from "./helpers/page-objects/finalisation/FinalisationTypePlacesPage";

// Increase timeout for full finalisation flow
test.setTimeout(120000);

test("Finalisation CAES avec CPOM - Flux complet", async ({ page }) => {
  // Generate unique DNA code
  const timestamp = Date.now().toString().slice(-6);
  const testData = {
    ...CAES_AVEC_CPOM_DATA,
    dnaCode: `K${timestamp}`,
  };

  // Step 0: Create structure via API (state: A_FINALISER by default)
  await createStructureViaApi(testData);
  const structureId = await getStructureId(testData.dnaCode);

  console.log(
    `✅ Structure créée via API: ${testData.dnaCode} (ID: ${structureId})`
  );

  // Step 1: Navigate to finalisation form
  await page.goto(
    `http://localhost:3000/structures/${structureId}/finalisation/01-identification`
  );

  // Step 2: Identification (fields already populated from structure)
  const identificationPage = new FinalisationIdentificationPage(page);
  await identificationPage.waitForLoad();
  await identificationPage.submit(structureId);
  console.log("✅ Étape 1/6: Identification complétée");

  // Step 3: Adresses (fields already populated)
  const adressesPage = new FinalisationAdressesPage(page);
  await adressesPage.waitForLoad();
  await adressesPage.submit(structureId);
  console.log("✅ Étape 2/6: Adresses complétée");

  // Step 4: Finance (skip - varies by structure type)
  const financePage = new FinalisationFinancePage(page);
  await financePage.waitForLoad();
  await financePage.submit(structureId);
  console.log("✅ Étape 3/6: Finance complétée");

  // Step 5: Type Places (fill required fields)
  const typePlacesPage = new FinalisationTypePlacesPage(page);
  await typePlacesPage.waitForLoad();
  await typePlacesPage.fillPlacesData();
  await typePlacesPage.submit(structureId);
  console.log("✅ Étape 4/6: Type de places complétée");

  // Step 6: Qualité (documents already created via API)
  const qualitePage = new FinalisationQualitePage(page);
  await qualitePage.waitForLoad();
  await qualitePage.submit(structureId);
  console.log("✅ Étape 5/6: Qualité complétée");

  // Step 7: Notes (final step)
  const notesPage = new FinalisationNotesPage(page);
  await notesPage.waitForLoad();
  await notesPage.fillNotes();
  await notesPage.submit(structureId);
  console.log("✅ Étape 6/6: Notes complétée");

  // Step 8: Verify success
  await notesPage.verifySuccess();
  console.log("🎉 Finalisation complète!");
});
