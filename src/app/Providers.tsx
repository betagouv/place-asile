"use client";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, ReactElement } from "react";

export const Providers = ({ children }: PropsWithChildren): ReactElement => {
  return <SessionProvider>{children}</SessionProvider>;
};
