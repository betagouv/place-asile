"use client";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, ReactElement } from "react";
// Import the zodErrorMap to apply the global error map
import "@/app/utils/zodErrorMap";

export const Providers = ({ children }: PropsWithChildren): ReactElement => {
  return <SessionProvider>{children}</SessionProvider>;
};
