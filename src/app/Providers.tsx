"use client";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, ReactElement, useEffect } from "react";
// Import the zodErrorMap to apply the global error map
import "@/app/utils/zodErrorMap";
import { init } from "@socialgouv/matomo-next";

export const Providers = ({ children }: PropsWithChildren): ReactElement => {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      init({
        url: process.env.MATOMO_URL!,
        siteId: process.env.MATOMO_SITE_ID!,
        disableCookies: true,
      });
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
};
