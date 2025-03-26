import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token");
  if (!token) {
    return NextResponse.redirect(process.env.NEXT_URL + "/connexion");
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/structures/:path*", "/operateurs/:path*", "/statistiques/:path*"],
};
