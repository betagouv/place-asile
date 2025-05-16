import { NextRequest, NextResponse } from "next/server";
import { findOneByKey } from "../file.repository";

export async function GET(request: NextRequest) {
  const encodedKey = request.nextUrl.pathname.split("/").pop();
  if (!encodedKey) {
    return NextResponse.json({ error: "Key not provided" }, { status: 400 });
  }

  const key = decodeURIComponent(encodedKey);

  const file = await findOneByKey(key);
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  return NextResponse.json(file);
}

export async function HEAD(request: NextRequest) {
  const encodedKey = request.nextUrl.pathname.split("/").pop();
  if (!encodedKey) {
    return new NextResponse(null, { status: 400 });
  }

  const key = decodeURIComponent(encodedKey);

  const file = await findOneByKey(key);
  if (file) {
    return new NextResponse(null, { status: 204 });
  } else {
    return new NextResponse(null, { status: 404 });
  }
}
