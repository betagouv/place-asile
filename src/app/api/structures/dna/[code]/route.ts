import { NextRequest, NextResponse } from "next/server";
import { findByDnaCode } from "../../structure.repository";
import { addCoordinates } from "../../structure.service";

// TODO : refacto pour fusionner avec [id]
export async function GET(request: NextRequest) {
  const code = request.nextUrl.pathname.split("/").pop();

  if (!code) {
    return NextResponse.json(
      { error: "DNA code is required" },
      { status: 400 }
    );
  }

  try {
    const structure = await findByDnaCode(code);

    if (!structure) {
      return NextResponse.json(null, { status: 404 });
    }

    const structureWithCoordinates = addCoordinates([structure]);
    return NextResponse.json(structureWithCoordinates);
  } catch (error) {
    console.error("Error fetching structure by DNA code:", error);
    return NextResponse.json(
      { error: "Failed to fetch structure" },
      { status: 500 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  const code = request.nextUrl.pathname.split("/").pop();

  if (!code) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const structure = await findByDnaCode(code);
    if (structure) {
      return new NextResponse(null, { status: 204 });
    } else {
      return new NextResponse(null, { status: 404 });
    }
  } catch (error) {
    console.error("Error checking structure by DNA code:", error);
    return new NextResponse(null, { status: 500 });
  }
}
