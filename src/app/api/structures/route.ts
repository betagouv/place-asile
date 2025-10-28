import { NextRequest, NextResponse } from "next/server";

import {
  structureCreationApiSchema,
  structureUpdateApiSchema,
} from "@/schemas/api/structure.schema";

import {
  createOne,
  deleteOne,
  findAll,
  updateOne,
} from "./structure.repository";

export async function GET() {
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = structureUpdateApiSchema.parse(body);
    await updateOne(result);
    return NextResponse.json("Structure mise à jour avec succès", {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  try {
    const { searchParams } = new URL(request.url);
    const dnaCode = searchParams.get("dnaCode");

    if (!dnaCode) {
      return NextResponse.json(
        { error: "Le code DNA est requis" },
        { status: 400 }
      );
    }

    await deleteOne(dnaCode);
    return NextResponse.json("Structure supprimée avec succès", {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
