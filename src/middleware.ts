import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  // TODO : améliorer la protection pour ne pas accepter n'importe quelle valeur de cookie
  // Creuser withAuth
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

  const token = request.cookies.get(cookieName);

  // Protection par token pour les routes sensibles
  const protectedPaths = ["/structures", "/operateurs", "/statistiques"];
  const isProtected = protectedPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(`${process.env.NEXT_URL}/connexion`);
  }

  // Protection par mot de passe simple pour /ajout-structure
  if (url.pathname.startsWith("/ajout-structure")) {
    const passwordCookie = request.cookies.get("mot-de-passe");
    if (passwordCookie?.value !== process.env.PAGE_PASSWORD) {
      const loginUrl = new URL("/mot-de-passe", request.url);
      loginUrl.searchParams.set("from", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
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
