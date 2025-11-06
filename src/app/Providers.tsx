"use client";

import "@/app/utils/zodErrorMap";

import { trackAppRouter } from "@socialgouv/matomo-next";
import { usePathname, useSearchParams } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, ReactElement, useEffect } from "react";

import { FetchStateProvider } from "./context/FetchStateContext";

export const Providers = ({ children }: PropsWithChildren): ReactElement => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      trackAppRouter({
        url: process.env.NEXT_PUBLIC_MATOMO_URL!,
        siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID!,
        pathname,
        searchParams,
        disableCookies: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SessionProvider>
      <FetchStateProvider>{children}</FetchStateProvider>
    </SessionProvider>
  );
};
