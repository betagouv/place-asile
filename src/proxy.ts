import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { withAuth } from "next-auth/middleware";

import { getApiRouteProtection } from "./app/utils/proxy.util";
import { authOptions } from "./lib/next-auth/auth";
import {
  noProtectionPage,
  passwordProtectedPage,
  proConnectProtectedPages,
} from "./proxy-config";

const proConnectPagesProxy = withAuth(() => NextResponse.next(), {
  callbacks: {
    authorized: ({ token }) => {
      return token !== null;
    },
  },
  pages: {
    signIn: "/connexion",
  },
});

const passwordPagesProxy = (request: NextRequest): NextResponse | null => {
  const url = request.nextUrl;
  if (url.pathname.startsWith(passwordProtectedPage)) {
    const passwordCookie = request.cookies.get("mot-de-passe");
    if (passwordCookie?.value !== process.env.PAGE_PASSWORD) {
      const loginUrl = new URL(noProtectionPage, request.url);
      loginUrl.searchParams.set("from", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return null;
};

const protectApiWithAuth = async (
  request: NextRequest
): Promise<NextResponse | null> => {
  const protection = getApiRouteProtection(request, request.nextUrl.pathname);
  const session = await getServerSession(authOptions);
  const hasProconnectSession = !!session?.user;
  const passwordCookie = request.cookies.get("mot-de-passe");
  const hasPassword = passwordCookie?.value === process.env.PAGE_PASSWORD;

  const isUnauthenticated =
    protection === null ||
    (protection === "proconnect" && !hasProconnectSession) ||
    (protection === "password" && !hasPassword) ||
    (protection === "either" && !hasProconnectSession && !hasPassword);

  if (isUnauthenticated) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  return null;
};

export async function proxy(request: NextRequest) {
  if (process.env.DEV_AUTH_BYPASS) {
    return NextResponse.next();
  }

  const apiAuthResult = await protectApiWithAuth(request);
  if (apiAuthResult) {
    return apiAuthResult;
  }

  const isProtected = proConnectProtectedPages.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected) {
    return (proConnectPagesProxy as (request: NextRequest) => NextResponse)(
      request
    );
  }

  return passwordPagesProxy(request) ?? NextResponse.next();
}

export const config = {
  matcher: [
    // Pages
    "/structures/:path*",
    "/operateurs/:path*",
    "/statistiques/:path*",
    "/ajout-structure/:path*",
    "/mot-de-passe",
    // Routes API
    "/api/:path*",
  ],
};
