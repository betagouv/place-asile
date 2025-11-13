"use client";

import "@/app/utils/zodErrorMap";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, ReactElement, Suspense } from "react";

import { Tracking } from "./components/Tracking";
import { FetchStateProvider } from "./context/FetchStateContext";

export const Providers = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <SessionProvider>
      <FetchStateProvider>
        <Suspense fallback={null}>
          <Tracking />
        </Suspense>
        {children}
      </FetchStateProvider>
    </SessionProvider>
  );
};
