export type Protection = "proconnect" | "password" | "either";

export const apiProtections: {
  [routePattern: string]: {
    [method: string]: Protection;
  };
} = {
  "/api/structures": {
    GET: "proconnect",
    PUT: "proconnect",
    POST: "password",
  },
  "/api/structures/[id]": {
    GET: "proconnect",
    HEAD: "proconnect",
  },
  "/api/structures/dna/[id]": {
    GET: "proconnect",
    HEAD: "proconnect",
  },
  "/api/files/[id]": {
    GET: "either",
    HEAD: "either",
    DELETE: "either",
  },
  "/api/files": {
    GET: "either",
    POST: "either",
  },
  "/api/operateurs": {
    GET: "proconnect",
    POST: "proconnect",
  },
};

export const proConnectProtectedPaths = [
  "/structures",
  "/operateurs",
  "/statistiques",
];

export const passwordProtectedPath = "/ajout-structure";

export const noProtectionPath = "/mot-de-passe";

export const signInRoute = "/connexion";
