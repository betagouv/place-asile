import { Page } from "@playwright/test";

/**
 * Mock the address API to avoid rate limiting and ensure consistent test results
 */
export async function mockAddressApi(page: Page): Promise<void> {
  await page.route(
    "https://api-adresse.data.gouv.fr/search/**",
    async (route) => {
      const mockResponse = {
        features: [
          {
            properties: {
              label: "1 Rue de la Paix, 75001 Paris",
              score: 0.9,
              housenumber: "1",
              street: "Rue de la Paix",
              postcode: "75001",
              city: "Paris",
              context: "75, Paris, Île-de-France",
              type: "housenumber",
              importance: 0.9,
              name: "1 Rue de la Paix",
              id: "75101_0001_1",
            },
            geometry: {
              coordinates: [2.3314, 48.8698],
            },
          },
        ],
      };
      await route.fulfill({ json: mockResponse });
    }
  );
}
