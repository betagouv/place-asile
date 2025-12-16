import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

const METABASE_SITE_URL = process.env.METABASE_SITE_URL as string;
const METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY as string;
const METABASE_DASHBOARD_ID = Number(process.env.METABASE_DASHBOARD_ID);

export async function GET() {
  if (!METABASE_SITE_URL || !METABASE_SECRET_KEY || !METABASE_DASHBOARD_ID) {
    return NextResponse.json(
      {
        error:
          "METABASE_SITE_URL, METABASE_SECRET_KEY et METABASE_DASHBOARD_ID doivent être définies dans les variables d'environnement",
      },
      { status: 500 }
    );
  }

  // Generate token for 24 hours
  const now = Math.round(Date.now() / 1000);
  const payload = {
    resource: { dashboard: METABASE_DASHBOARD_ID },
    params: {},
    iat: now,
    exp: now + 24 * 60 * 60,
  };

  const token = sign(payload, METABASE_SECRET_KEY);

  const iframeUrl =
    `${METABASE_SITE_URL}` +
    `/embed/dashboard/${token}` +
    "#background=false&bordered=false&titled=false";

  return NextResponse.json({ iframeUrl });
}
