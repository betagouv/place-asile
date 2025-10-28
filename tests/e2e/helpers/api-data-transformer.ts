import { TestStructureData } from "./test-data";

// Helper function to get a valid operateur ID
async function getValidOperateurId(): Promise<number> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/structures`
    );
    if (response.ok) {
      const structures = await response.json();
      if (structures.length > 0 && structures[0].operateur) {
        return structures[0].operateur.id;
      }
    }
  } catch {
    console.warn(
      "Could not fetch structures to get operateur ID, using default ID 11"
    );
  }
  return 11; // Fallback to ID 11 (seen in the structures response)
}

/**
 * Transforms test data format to API structure creation format
 */
export async function transformTestDataToApiFormat(
  testData: TestStructureData
) {
  const { identification, adresses, typologies } = testData;

  // Extract department from postal code (first 2 digits for most, or "2A"/"2B" for Corsica)
  const extractDepartment = (postalCode: string): string => {
    if (postalCode.startsWith("20")) {
      return postalCode.substring(0, 3); // Corsica: 201, 202, etc.
    }
    return postalCode.substring(0, 2);
  };

  // Parse address from autocomplete format
  const parseAddress = (searchTerm: string) => {
    // Simple parsing - in real scenario this would match the autocomplete data
    const parts = searchTerm.split(" ");
    const postalCodeMatch = parts.find((p) => /^\d{5}$/.test(p));
    const postalCode = postalCodeMatch || "75001";

    // Find city name (usually after postal code)
    const postalIndex = parts.findIndex((p) => p === postalCode);
    const city =
      postalIndex > -1 ? parts.slice(postalIndex + 1).join(" ") : "Paris";

    // Street is everything before postal code
    const street =
      postalIndex > -1 ? parts.slice(0, postalIndex).join(" ") : searchTerm;

    return {
      street: street || "1 rue de Test",
      postalCode,
      city: city || "Paris",
      department: extractDepartment(postalCode),
    };
  };

  const adminAddress = parseAddress(adresses.adresseAdministrative.complete);

  // Transform contacts to array
  const contacts = [];

  if (identification.contactPrincipal) {
    contacts.push({
      prenom: identification.contactPrincipal.prenom,
      nom: identification.contactPrincipal.nom,
      telephone: identification.contactPrincipal.telephone,
      email: identification.contactPrincipal.email,
      role: identification.contactPrincipal.role,
    });
  }

  if (identification.contactSecondaire) {
    contacts.push({
      prenom: identification.contactSecondaire.prenom,
      nom: identification.contactSecondaire.nom,
      telephone: identification.contactSecondaire.telephone,
      email: identification.contactSecondaire.email,
      role: identification.contactSecondaire.role,
    });
  }

  // Transform typologies with dates
  const currentYear = new Date().getFullYear();
  const transformedTypologies = typologies.map((typo, index) => ({
    date: new Date(`${currentYear - index}-01-01`), // Current year, previous year, etc.
    placesAutorisees: typo.placesAutorisees,
    pmr: typo.pmr,
    lgbt: typo.lgbt,
    fvvTeh: typo.fvvTeh,
  }));

  // Transform addresses with nested typologies
  const transformedAdresses = adresses.sameAddress
    ? [
        {
          adresse: adminAddress.street,
          codePostal: adminAddress.postalCode,
          commune: adminAddress.city,
          repartition: adresses.typeBati,
          adresseTypologies: [
            {
              placesAutorisees: typologies[0].placesAutorisees,
              date: new Date(`${currentYear}-01-01`),
              qpv: 0, // Convert boolean to number
              logementSocial: 0, // Convert boolean to number
            },
          ],
        },
      ]
    : (adresses.adresses || []).map((addr) => {
        const parsed = parseAddress(addr.adresseComplete); // Use adresseComplete instead of searchTerm
        return {
          adresse: parsed.street,
          codePostal: parsed.postalCode,
          commune: parsed.city,
          repartition: addr.repartition || adresses.typeBati,
          adresseTypologies: [
            {
              placesAutorisees: addr.placesAutorisees,
              date: new Date(`${currentYear}-01-01T00:00:00.000Z`),
              qpv: 0,
              logementSocial: 0,
            },
          ],
        };
      });

  // Get a valid operateur ID
  const operateurId = await getValidOperateurId();

  // Build the API payload
  const apiData = {
    dnaCode: testData.dnaCode,
    operateur: {
      id: operateurId,
      name: identification.operateur.name,
    },
    filiale: identification.filiale,
    type: testData.type,
    adresseAdministrative: adminAddress.street,
    codePostalAdministratif: adminAddress.postalCode,
    communeAdministrative: adminAddress.city,
    departementAdministratif: adminAddress.department,
    nom: adresses.nom,
    ...(identification.debutConvention && {
      debutConvention: new Date(identification.debutConvention),
    }),
    ...(identification.finConvention && {
      finConvention: new Date(identification.finConvention),
    }),
    cpom: testData.cpom,
    creationDate: new Date(identification.creationDate),
    finessCode: identification.finessCode,
    lgbt: identification.lgbt,
    fvvTeh: identification.fvvTeh,
    public: identification.public,
    ...(identification.debutPeriodeAutorisation && {
      debutPeriodeAutorisation: new Date(
        identification.debutPeriodeAutorisation
      ),
    }),
    // Include finPeriodeAutorisation for authorized structures (CADA, CPH)
    ...(identification.finPeriodeAutorisation && {
      finPeriodeAutorisation: new Date(identification.finPeriodeAutorisation),
    }),
    ...(identification.debutCpom && {
      debutCpom: new Date(identification.debutCpom),
    }),
    ...(identification.finCpom && {
      finCpom: new Date(identification.finCpom),
    }),
    adresses: transformedAdresses,
    contacts,
    structureTypologies: transformedTypologies,
    fileUploads: [], // Skip file uploads for comprehensive tests to avoid database key issues
  };

  return apiData;
}
