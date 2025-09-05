"use client";

import "@/app/utils/zodErrorMap";

import { init } from "@socialgouv/matomo-next";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, ReactElement, useEffect } from "react";

export const Providers = ({ children }: PropsWithChildren): ReactElement => {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      init({
        url: process.env.NEXT_PUBLIC_MATOMO_URL!,
        siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID!,
        disableCookies: true,
      });
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
};
