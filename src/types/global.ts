export type Page = {
  params: Promise<{
    [key: string]: string;
  }>;
  searchParams: Promise<{
    [key: string]: string;
  }>;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export const FormKind = {
  MODIFICATION: "modification",
  FINALISATION: "finalisation",
} as const;

export type FormKind = (typeof FormKind)[keyof typeof FormKind];
