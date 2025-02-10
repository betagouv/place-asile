"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Home() {
  const CentresMap = useMemo(
    () =>
      dynamic(() => import("./components/CentresMap"), {
        loading: () => <p>Chargement de la carte en cours...</p>,
        ssr: false,
      }),
    []
  );
  return <CentresMap />;
}
