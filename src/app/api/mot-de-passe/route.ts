import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.PAGE_PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("mot-de-passe", password, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return res;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
