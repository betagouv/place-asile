import { NextRequest, NextResponse } from "next/server";

import { requireProConnectAuth } from "@/lib/api-auth";
import {
  structureCreationApiSchema,
  structureUpdateApiSchema,
} from "@/schemas/api/structure.schema";

import { createOne, findAll, updateOne } from "./structure.repository";

export async function GET() {
  const authResult = await requireProConnectAuth();
  if (authResult.status === 401) {
    return authResult;
  }
  const structures = await findAll();
  return NextResponse.json(structures);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = structureCreationApiSchema.parse(body);
    await createOne(result);
    return NextResponse.json("Structure créée avec succès", { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await requireProConnectAuth();
  if (authResult.status === 401) {
    return authResult;
  }

  try {
    const body = await request.json();
    const result = structureUpdateApiSchema.parse(body);
    await updateOne(result);
    return NextResponse.json("Structure mise à jour avec succès", {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 400 });
  }
}
