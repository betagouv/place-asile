import { NextRequest, NextResponse } from "next/server";

import { requireProConnectAuth } from "@/lib/api-auth";
import { operateursApiSchema } from "@/schemas/api/operateur.schema";

import { createOne, findBySearchTerm } from "./operateur.repository";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search");
  const operateurs = await findBySearchTerm(search);
  return NextResponse.json(operateurs);
}

export async function POST(request: NextRequest) {
  const authResult = await requireProConnectAuth();
  if (authResult.status === 401) {
    return authResult;
  }

  try {
    const body = await request.json();
    const result = operateursApiSchema.parse(body);
    await createOne(result);
    return NextResponse.json("Opérateurs créés avec succès", { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 400 });
  }
}
