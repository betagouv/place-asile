import { z } from "zod";

// Types pour les propriétés spécifiques des issues Zod
type ZodIssueWithReceived = z.ZodIssue & { received: string; expected: string };
type ZodIssueWithKeys = z.ZodIssue & { keys: string[] };
type ZodIssueWithType = z.ZodIssue & { type: string };
type ZodIssueWithMinimum = z.ZodIssue & { minimum: number };
type ZodIssueWithMaximum = z.ZodIssue & { maximum: number };
type ZodIssueWithMultipleOf = z.ZodIssue & { multipleOf: number };

// French error messages for Zod
export const frenchErrorMap = (
  issue: z.ZodIssue,
  ctx: { defaultError?: string }
): { message: string } => {
  // Default error message in French
  let message = "Champ invalide";

  switch (issue.code) {
    case "invalid_type": {
      const typedIssue = issue as ZodIssueWithReceived;
      if (
        typedIssue.received === "undefined" ||
        typedIssue.received === "null"
      ) {
        message = "Ce champ est requis";
      } else {
        message = `Type attendu : ${typedIssue.expected}, reçu : ${typedIssue.received}`;
      }
      break;
    }
    case "unrecognized_keys": {
      const typedIssue = issue as ZodIssueWithKeys;
      message = `Clé(s) non reconnue(s) : ${typedIssue.keys?.join(", ")}`;
      break;
    }
    case "invalid_union":
      message = "Entrée invalide";
      break;
    case "invalid_value":
      message = "Valeur invalide";
      break;
    case "too_small": {
      const typedIssue = issue as ZodIssueWithType & ZodIssueWithMinimum;
      if (typedIssue.type === "array")
        message = `Doit contenir au moins ${typedIssue.minimum} élément(s)`;
      else if (typedIssue.type === "string")
        message = `Doit contenir au moins ${typedIssue.minimum} caractère(s)`;
      else if (typedIssue.type === "number")
        message = `Doit être supérieur ou égal à ${typedIssue.minimum}`;
      else message = "Valeur trop petite";
      break;
    }
    case "too_big": {
      const typedIssue = issue as ZodIssueWithType & ZodIssueWithMaximum;
      if (typedIssue.type === "array")
        message = `Doit contenir au maximum ${typedIssue.maximum} élément(s)`;
      else if (typedIssue.type === "string")
        message = `Doit contenir au maximum ${typedIssue.maximum} caractère(s)`;
      else if (typedIssue.type === "number")
        message = `Doit être inférieur ou égal à ${typedIssue.maximum}`;
      else message = "Valeur trop grande";
      break;
    }
    case "custom":
      message = "Validation échouée";
      break;
    case "not_multiple_of": {
      const typedIssue = issue as ZodIssueWithMultipleOf;
      message = `Doit être un multiple de ${typedIssue.multipleOf}`;
      break;
    }
    default:
      message = ctx.defaultError || "Champ invalide";
  }

  return { message };
};

// Set the error map globally
z.setErrorMap(frenchErrorMap as unknown as z.ZodErrorMap);
