"use client";

import { ReactElement, useEffect, useState } from "react";

export default function Usage(): ReactElement {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIframeUrl = async () => {
      try {
        const response = await fetch("/api/metabase");
        if (!response.ok) {
          throw new Error("Erreur lors de la génération du token Metabase");
        }
        const data = await response.json();
        setIframeUrl(data.iframeUrl);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      }
    };

    fetchIframeUrl();
  }, []);

  if (error) {
    return (
      <div className="flex-1 w-full flex justify-center items-center py-8">
        <div className="text-red-600">Erreur : {error}</div>
      </div>
    );
  }

  if (!iframeUrl) {
    return (
      <div className="flex-1 w-full flex justify-center items-center py-8">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex justify-center items-stretch py-8">
      <div className="w-4/5">
        <iframe
          src={iframeUrl}
          className="border-0 w-full h-full"
          allowTransparency={true}
          title="Statistiques Place d'Asile"
        />
      </div>
    </div>
  );
}
