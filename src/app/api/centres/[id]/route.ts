import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const centre = await prisma.structure.findUnique({
    where: {
      id: Number(id),
    },
  });
  return NextResponse.json(centre);
}
