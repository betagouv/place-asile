import { NextRequest, NextResponse } from "next/server";

import { findBySearchTerm } from "./structure-ofii.repository";

export async function GET(request: NextRequest) {
  const operateurId = request.nextUrl.searchParams.get("operateur");
  const departementNumero = request.nextUrl.searchParams.get("departement");
  const type = request.nextUrl.searchParams.get("type");
  const operateurs = await findBySearchTerm(
    operateurId,
    departementNumero,
    type
  );
  return NextResponse.json(operateurs);
}
