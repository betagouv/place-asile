import { z } from "zod";

// French error messages for Zod
export const frenchErrorMap = (
  issue: z.ZodIssue,
  ctx: any
): { message: string } => {
  // Default error message in French
  let message = "Champ invalide";

  switch (issue.code) {
    case "invalid_type":
      if (
        (issue as any).received === "undefined" ||
        (issue as any).received === "null"
      ) {
        message = "Ce champ est requis";
      } else {
        message = `Type attendu : ${(issue as any).expected}, reçu : ${(issue as any).received}`;
      }
      break;
    case "unrecognized_keys":
      message = `Clé(s) non reconnue(s) : ${(issue as any).keys?.join(", ")}`;
      break;
    case "invalid_union":
      message = "Entrée invalide";
      break;
    case "invalid_value":
      message = "Valeur invalide";
      break;
    case "too_small":
      if ((issue as any).type === "array")
        message = `Doit contenir au moins ${(issue as any).minimum} élément(s)`;
      else if ((issue as any).type === "string")
        message = `Doit contenir au moins ${(issue as any).minimum} caractère(s)`;
      else if ((issue as any).type === "number")
        message = `Doit être supérieur ou égal à ${(issue as any).minimum}`;
      else message = "Valeur trop petite";
      break;
    case "too_big":
      if ((issue as any).type === "array")
        message = `Doit contenir au maximum ${(issue as any).maximum} élément(s)`;
      else if ((issue as any).type === "string")
        message = `Doit contenir au maximum ${(issue as any).maximum} caractère(s)`;
      else if ((issue as any).type === "number")
        message = `Doit être inférieur ou égal à ${(issue as any).maximum}`;
      else message = "Valeur trop grande";
      break;
    case "custom":
      message = "Validation échouée";
      break;
    case "not_multiple_of":
      message = `Doit être un multiple de ${(issue as any).multipleOf}`;
      break;
    default:
      message = ctx.defaultError || "Champ invalide";
  }

  return { message };
};

// Set the error map globally
z.setErrorMap(frenchErrorMap as any);
