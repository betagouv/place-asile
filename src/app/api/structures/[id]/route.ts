import { NextRequest, NextResponse } from "next/server";

import { findOne } from "../structure.repository";
import {
  addPresencesIndues,
  StructureWithActivites,
} from "../structure.service";

export async function GET(request: NextRequest) {
  try {
    console.log(request.nextUrl.pathname);
    const id = request.nextUrl.pathname.split("/").pop();
    const structure = await findOne(Number(id));

    if (!structure) {
      return NextResponse.json(
        { error: "Structure not found" },
        { status: 404 }
      );
    }

    const structureWithPresencesIndues = addPresencesIndues(
      structure as StructureWithActivites
    );
    return NextResponse.json(structureWithPresencesIndues);
  } catch (error) {
    console.error("Error in GET /api/structures/[id]:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const structure = await findOne(Number(id));
  if (structure) {
    return new NextResponse(null, { status: 204 });
  } else {
    return new NextResponse(null, { status: 404 });
  }
}
