import { expect, test } from "@playwright/test";

test.describe("Structures filters and ordering", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to structures page (you'll need to authenticate first)
    await page.goto("http://localhost:3000/structures");
    await page.waitForLoadState("networkidle");
  });

  test("should filter structures by excluding a type when clicking checkbox", async ({
    page,
  }) => {
    // Click filters button
    await page.getByRole("button", { name: "Filtres" }).click();

    // When no filter is selected, all checkboxes appear checked
    // Clicking CADA will uncheck it and exclude CADA structures
    const cadaCheckbox = page.getByLabel("CADA");
    await cadaCheckbox.click();

    // Wait for the table to update
    await page.waitForLoadState("networkidle");

    // Verify URL reflects the filter (excludes CADA)
    expect(page.url()).toContain("type=");
    expect(page.url()).not.toContain("CADA");

    // Verify no CADA structures are shown
    const cadaCells = page.locator('tbody tr td[aria-label="CADA"]');
    await expect(cadaCells).toHaveCount(0);
  });

  test("should order structures by DNA code ascending", async ({ page }) => {
    // Click the DNA column ordering button
    const dnaHeader = page.getByRole("columnheader", { name: /DNA/i });
    const orderButton = dnaHeader.locator('button[aria-label*="dnaCode"]');
    await orderButton.click();

    // Wait for the table to update
    await page.waitForLoadState("networkidle");

    // Verify URL contains ordering params
    expect(page.url()).toContain("column=dnaCode");
    expect(page.url()).toContain("direction=asc");

    // Verify structures are ordered correctly
    const dnaCodes = await page
      .locator("tbody tr td:first-child")
      .allTextContents();
    const sortedDnaCodes = [...dnaCodes].sort();
    expect(dnaCodes).toEqual(sortedDnaCodes);
  });

  test("should toggle ordering direction", async ({ page }) => {
    // Click once for ascending
    const typeHeader = page.getByRole("columnheader", { name: /Type/i });
    const orderButton = typeHeader.locator('button[aria-label*="type"]');
    await orderButton.click();
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("direction=asc");

    // Click again for descending
    await orderButton.click();
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("direction=desc");

    // Click again to clear ordering
    await orderButton.click();
    await page.waitForLoadState("networkidle");

    expect(page.url()).not.toContain("column=");
    expect(page.url()).not.toContain("direction=");
  });

  test("should filter by department and maintain ordering", async ({
    page,
  }) => {
    // Apply department filter
    await page.getByRole("button", { name: /Région \/ Département/i }).click();

    // Find and expand the "Île-de-France" accordion
    const ileDeFranceAccordion = page.getByRole("button", {
      name: /Île-de-France/i,
    });
    await ileDeFranceAccordion.click();

    // Wait for the accordion to expand
    await page.waitForTimeout(300);

    // Now select "Paris - 75" checkbox
    const parisCheckbox = page.getByLabel("Paris - 75");
    await parisCheckbox.click();

    // Click outside to close the panel
    await page.click("body");

    await page.waitForLoadState("networkidle");

    // Apply ordering
    const deptHeader = page.getByRole("columnheader", { name: /Dépt/i });
    const orderButton = deptHeader.locator(
      'button[aria-label*="departementAdministratif"]'
    );
    await orderButton.click();

    await page.waitForLoadState("networkidle");

    // Verify both filter and ordering are in URL
    expect(page.url()).toContain("departements=75");
    expect(page.url()).toContain("column=departementAdministratif");

    // Verify all structures have department 75
    const deptCells = page.locator("tbody tr td:nth-child(4)");
    const count = await deptCells.count();
    for (let i = 0; i < count; i++) {
      const text = await deptCells.nth(i).textContent();
      expect(text).toBe("75");
    }
  });

  test("should combine type exclusion with ordering", async ({ page }) => {
    // First, exclude CADA type
    await page.getByRole("button", { name: "Filtres" }).click();
    await page.getByLabel("CADA").click();
    await page.waitForLoadState("networkidle");

    // Then apply ordering
    const operateurHeader = page.getByRole("columnheader", {
      name: /Opérateur/i,
    });
    const orderButton = operateurHeader.locator(
      'button[aria-label*="operateur"]'
    );
    await orderButton.click();
    await page.waitForLoadState("networkidle");

    // Verify both filter and ordering are in URL
    expect(page.url()).toContain("type=");
    expect(page.url()).not.toContain("CADA");
    expect(page.url()).toContain("column=operateur");
    expect(page.url()).toContain("direction=asc");

    // Verify no CADA structures are shown
    const cadaCells = page.locator('tbody tr td[aria-label="CADA"]');
    await expect(cadaCells).toHaveCount(0);
  });

  test("should persist filters and ordering in URL on page refresh", async ({
    page,
  }) => {
    // Apply filters (exclude CADA) and ordering
    await page.getByRole("button", { name: "Filtres" }).click();
    await page.getByLabel("CADA").click();

    const dnaHeader = page.getByRole("columnheader", { name: /DNA/i });
    await dnaHeader.locator('button[aria-label*="dnaCode"]').click();

    await page.waitForLoadState("networkidle");

    const url = page.url();

    // Refresh page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify filters and ordering are still applied
    expect(page.url()).toBe(url);

    // Verify active indicators are shown
    const filterButton = page.getByRole("button", { name: "Filtres" });
    const indicator = filterButton.locator(".bg-border-action-high-warning");
    await expect(indicator).toBeVisible();

    // Verify no CADA structures are still shown
    const cadaCells = page.locator('tbody tr td[aria-label="CADA"]');
    await expect(cadaCells).toHaveCount(0);
  });
});
