import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

const proConnectMiddleware = withAuth(() => NextResponse.next(), {
  callbacks: {
    authorized: ({ token }) => {
      return token !== null;
    },
  },
  pages: {
    signIn: "/connexion",
  },
});

const protectByPassword = (request: NextRequest): NextResponse | undefined => {
  const url = request.nextUrl;
  if (url.pathname.startsWith("/ajout-structure")) {
    const passwordCookie = request.cookies.get("mot-de-passe");
    if (passwordCookie?.value !== process.env.PAGE_PASSWORD) {
      const loginUrl = new URL("/mot-de-passe", request.url);
      loginUrl.searchParams.set("from", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return undefined;
};

export async function middleware(request: NextRequest) {
  const protectedPaths = ["/structures", "/operateurs", "/statistiques"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (proConnectMiddleware as any)(request);
  }

  const passwordResult = protectByPassword(request);
  if (passwordResult) {
    return passwordResult;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/structures/:path*",
    "/operateurs/:path*",
    "/statistiques/:path*",
    "/ajout-structure/:path*",
    "/mot-de-passe",
  ],
};
