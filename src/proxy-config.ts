import { ApiRoute } from "./types/proxy.type";

export const protectedApiRoutes: ApiRoute[] = [
  {
    pattern: /^\/api\/structures$/,
    routes: {
      GET: "proconnect",
      PUT: "proconnect",
      POST: "password",
    },
  },
  {
    pattern: /^\/api\/structures\/[^/]+$/,
    routes: {
      GET: "proconnect",
    },
  },
  {
    pattern: /^\/api\/structures\/dna\/[^/]+$/,
    routes: {
      GET: "proconnect",
    },
  },
  {
    pattern: /^\/api\/files\/[^/]+$/,
    routes: {
      GET: "either",
      DELETE: "either",
    },
  },
  {
    pattern: /^\/api\/files$/,
    routes: {
      POST: "either",
    },
  },
  {
    pattern: /^\/api\/operateurs$/,
    routes: {
      GET: "proconnect",
      POST: "proconnect",
    },
  },
  {
    pattern: /^\/api\/structures\/stats$/,
    routes: {
      GET: "proconnect",
      POST: "proconnect",
    },
  },
  {
    pattern: /^\/api\/structures-ofii$/,
    routes: {
      GET: "proconnect",
      POST: "proconnect",
    },
  },
];

export const proConnectProtectedPages = [
  "/structures",
  "/operateurs",
  "/statistiques",
];

export const passwordProtectedPage = "/ajout-structure";

export const noProtectionPage = "/mot-de-passe";
