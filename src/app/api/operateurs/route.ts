import { NextRequest, NextResponse } from "next/server";

import { createOne, findBySearchTerm } from "./operateur.repository";
import { operateurCreationSchema } from "./operateur.schema";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search");
  const operateurs = await findBySearchTerm(search);
  return NextResponse.json(operateurs);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = operateurCreationSchema.parse(body);
    await createOne(result);
    return NextResponse.json("Opérateurs créés avec succès", { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 400 });
  }
}
