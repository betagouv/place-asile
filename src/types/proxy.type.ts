export type Protection = "proconnect" | "password" | "either" | "none";

export type ApiRoute = {
  pattern: RegExp;
  routes: Record<string, Protection>;
};
