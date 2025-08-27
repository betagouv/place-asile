"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html data-scroll-behavior="smooth">
      <body className="h-full">
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
