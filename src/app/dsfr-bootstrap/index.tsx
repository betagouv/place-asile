"use client";

import {
  DsfrProviderBase,
  StartDsfrOnHydration,
} from "@codegouvfr/react-dsfr/next-app-router";
import Link from "next/link";

import { defaultColorScheme } from "./defaultColorScheme";

declare module "@codegouvfr/react-dsfr/next-app-router" {
  interface RegisterLink {
    Link: typeof Link;
  }
}

export function DsfrProvider(props: {
  lang: string | undefined;
  children: React.ReactNode;
}) {
  const { lang, children } = props;
  return (
    <DsfrProviderBase
      lang={lang}
      defaultColorScheme={defaultColorScheme}
      Link={Link}
    >
      {children}
    </DsfrProviderBase>
  );
}

export { StartDsfrOnHydration };
