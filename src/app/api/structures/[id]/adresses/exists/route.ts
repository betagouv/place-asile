import { NextRequest, NextResponse } from "next/server";

import { checkAdressesExistence } from "@/app/api/adresses/adresse.repository";
import { findOne } from "@/app/api/structures/structure.repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const structure = await findOne(Number(id));

    const hasAdresses = await checkAdressesExistence(structure.dnaCode);

    return NextResponse.json(hasAdresses);
  } catch (error) {
    console.error("Error in GET /api/structures/[id]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
