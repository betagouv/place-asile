import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

import {
  noProtectionPath,
  passwordProtectedPath,
  proConnectProtectedPaths,
  Protection,
  signInRoute,
} from "./middleware-config";
import { matchApiRoute } from "./middleware-utils";

const proConnectMiddleware = withAuth(() => NextResponse.next(), {
  callbacks: {
    authorized: ({ token }) => {
      console.log(">>>>>>>>>>>>>>>>", token !== null);
      return token !== null;
    },
  },
  pages: {
    signIn: signInRoute,
  },
});

const protectByPassword = (request: NextRequest): NextResponse | undefined => {
  const url = request.nextUrl;
  if (url.pathname.startsWith(passwordProtectedPath)) {
    const passwordCookie = request.cookies.get("mot-de-passe");
    if (passwordCookie?.value !== process.env.PAGE_PASSWORD) {
      const loginUrl = new URL("/mot-de-passe", request.url);
      loginUrl.searchParams.set("from", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return undefined;
};

const handleProtection = async (
  request: NextRequest,
  protection: Protection
): Promise<NextResponse | undefined> => {
  if (protection === "proconnect") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (proConnectMiddleware as any)(request);
  }
  if (protection === "password") {
    return protectByPassword(request) ?? NextResponse.next();
  }
  if (protection === "either") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proConnectResult = await (proConnectMiddleware as any)(request);
    if (proConnectResult?.status === 200) {
      return proConnectResult;
    }
    const passwordResult = protectByPassword(request);
    if (passwordResult) {
      return passwordResult;
    }
    return NextResponse.redirect(new URL(signInRoute, request.url));
  }
  return undefined;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const apiMatch = matchApiRoute(request, pathname);
  if (apiMatch && apiMatch.method === request.method) {
    return handleProtection(request, apiMatch.protection);
  }

  if (proConnectProtectedPaths.some((path) => pathname.startsWith(path))) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (proConnectMiddleware as any)(request);
  }

  if (pathname.startsWith(passwordProtectedPath)) {
    const result = protectByPassword(request);
    if (result) return result;
  }

  if (pathname === noProtectionPath) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Frontend routes
    "/structures/:path*",
    "/operateurs/:path*",
    "/statistiques/:path*",
    "/ajout-structure/:path*",
    "/mot-de-passe",
    // API routes
    "/api/structures",
    "/api/structures/:id*",
    "/api/structures/dna/:id*",
    "/api/files",
    "/api/files/:id*",
    "/api/operateurs",
  ],
};
