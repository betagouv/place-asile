export type Protection = "proconnect" | "password" | "either";

export type ApiRoute = {
  pattern: RegExp;
  routes: Record<string, Protection>;
};
