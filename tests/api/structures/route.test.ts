import { describe, it, expect } from "vitest";
import { createMocks } from "node-mocks-http";
import { POST } from "@/app/api/structures/route";
import { createStructure } from "../../test-utils/structure.factory";

const validPayload = {
  dnaCode: "ABC123",
  operateur: "Opérateur X",
  filiale: "Filiale Y",
  type: "CADA",
  nbPlaces: 20,
  adresseAdministrative: "1 rue de la Paix",
  codePostalAdministratif: "75000",
  communeAdministrative: "Paris",
  departementAdministratif: "75",
  nom: "Structure test",
  debutConvention: "2024-01-01",
  finConvention: "2025-01-01",
  cpom: true,
  creationDate: "2023-12-31",
  finessCode: "123456789",
  lgbt: false,
  fvvTeh: true,
  public: "Tout public",
  debutPeriodeAutorisation: "2024-01-01",
  finPeriodeAutorisation: "2025-01-01",
  debutCpom: "2024-01-01",
  finCpom: "2025-01-01",
  adresses: [
    {
      adresse: "2 avenue des Champs",
      codePostal: "75008",
      commune: "Paris",
      repartition: "Collectif",
      typologies: [
        {
          nbPlacesTotal: 10,
          date: "2024-01-01",
          qpv: 0,
          logementSocial: 1,
        },
      ],
    },
  ],
  contacts: [
    {
      prenom: "Jean",
      nom: "Dupont",
      telephone: "0601020304",
      email: "jean.dupont@example.com",
      role: "Directeur",
    },
  ],
  typologies: [
    {
      date: "2024-01-01",
      pmr: 2,
      lgbt: 1,
      fvvTeh: 0,
    },
  ],
  fileUploads: [
    {
      key: "document1.pdf",
      date: "2024-01-01",
      category: "budgetPrevisionnelDemande",
    },
  ],
};

// TODO : implémenter ces tests
describe.skip("API Route: /api/structures", () => {
  it("should return 400 when given an empty JSON", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    req.body = { data: {} };

    await POST(req);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Le code DNA est requis" });
  });

  it("should return 201 when given a fully valid structure", async () => {
    const { req, res } = createMocks({ method: "POST" });
    req.body = { data: validPayload };

    await POST(req);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({});
  });

  it("should return 400 if dnaCode is missing", async () => {
    const { req, res } = createMocks({ method: "POST" });
    const structure = createStructure({});
    // delete structure.dnaCode;
    req.body = { data: structure };

    await POST(req);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Le code DNA est requis" });
  });

  it("should return 400 if operateur is missing", async () => {
    const { req, res } = createMocks({ method: "POST" });
    const structure = createStructure({});
    // delete structure.operateur;
    req.body = { data: structure };

    await POST(req);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "L'opérateur est requis" });
  });

  it("should return 400 for nbPlaces=0", async () => {
    const { req, res } = createMocks({ method: "POST" });
    const structure = createStructure({ nbPlaces: 0 });
    req.body = { data: structure };

    await POST(req);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "Le nombre de places autorisées est requis",
    });
  });

  it("should return 400 for missing adresseAdministrative", async () => {
    const { req, res } = createMocks({ method: "POST" });
    const structure = createStructure({});
    // delete structure.adresseAdministrative;
    req.body = { data: structure };

    await POST(req);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "L'adresse administrative est requise",
    });
  });

  it("should return 400 for missing contacts", async () => {
    const { req, res } = createMocks({ method: "POST" });
    const structure = createStructure({});
    structure.contacts = [];
    req.body = { data: structure };

    await POST(req);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toHaveProperty("error");
  });

  it("should return 400 for an invalid email in contacts", async () => {
    const { req, res } = createMocks({ method: "POST" });
    const structure = createStructure({});
    // structure.contacts[0].email = "not-an-email";
    req.body = { data: structure };

    await POST(req);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toHaveProperty("error");
  });

  it("should return 400 if required field in adresses is missing", async () => {
    const { req, res } = createMocks({ method: "POST" });
    const structure = createStructure({});
    // delete structure.adresses[0].adresse;
    req.body = { data: structure };

    await POST(req);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toHaveProperty("error");
  });
});
