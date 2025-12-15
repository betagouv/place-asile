import { sign } from "jsonwebtoken";
import { ReactElement } from "react";

const METABASE_SITE_URL = process.env.METABASE_SITE_URL as string;
const METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY as string;
const METABASE_DASHBOARD_ID = Number(process.env.METABASE_DASHBOARD_ID);

const getMetabaseIframeUrl = (dashboardId: number): string => {
  if (!METABASE_SITE_URL || !METABASE_SECRET_KEY) {
    throw new Error(
      "METABASE_SITE_URL et METABASE_SECRET_KEY doivent être définies dans les variables d'environnement"
    );
  }

  const payload = {
    resource: { dashboard: dashboardId },
    params: {},
    exp: Math.round(Date.now() / 1000) + 60 * 60, // 1 heure
  };

  const token = sign(payload, METABASE_SECRET_KEY);

  return (
    `${METABASE_SITE_URL}` +
    `/embed/dashboard/${token}` +
    "#background=false&bordered=false&titled=false"
  );
};

export default function Usage(): ReactElement {
  const iframeUrl = getMetabaseIframeUrl(METABASE_DASHBOARD_ID);

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
