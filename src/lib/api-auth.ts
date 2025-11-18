import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "./next-auth/auth";

export const requireProConnectAuth = async (): Promise<NextResponse> => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.log("session null");
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  return NextResponse.next();
};
