import { NextRequest, NextResponse } from "next/server";

import { requireProConnectAuth } from "@/lib/api-auth";

import { findOne } from "../structure.repository";
import {
  addPresencesIndues,
  divideFileUploads,
  StructureWithFileUploadsAndActivites,
} from "../structure.service";

export async function GET(request: NextRequest) {
  const authResult = await requireProConnectAuth();
  if (authResult.status === 401) {
    return authResult;
  }

  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const structure = await findOne(Number(id));

    if (!structure) {
      return NextResponse.json(
        { error: "Structure not found" },
        { status: 404 }
      );
    }

    const structureWithPresencesIndues = addPresencesIndues(
      structure as StructureWithFileUploadsAndActivites
    );
    const structureWithDividedFileUploads = divideFileUploads(
      structureWithPresencesIndues
    );
    return NextResponse.json(structureWithDividedFileUploads);
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
