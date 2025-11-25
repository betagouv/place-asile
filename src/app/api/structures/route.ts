import { NextRequest, NextResponse } from "next/server";

import {
  structureCreationApiSchema,
  structureUpdateApiSchema,
} from "@/schemas/api/structure.schema";
import { StructureColumn } from "@/types/StructureColumn.type";

import {
  countBySearch,
  createOne,
  findBySearch,
  updateOne,
} from "./structure.repository";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search");
  const page = request.nextUrl.searchParams.get("page") as number | null;
  const type = request.nextUrl.searchParams.get("type");
  const bati = request.nextUrl.searchParams.get("bati");
  const placesAutorisees = request.nextUrl.searchParams.get("places") as
    | string
    | null;
  const departements = request.nextUrl.searchParams.get("departements");
  const column = request.nextUrl.searchParams.get(
    "column"
  ) as StructureColumn | null;
  const direction = request.nextUrl.searchParams.get("direction") as
    | "asc"
    | "desc"
    | null;
  const map = request.nextUrl.searchParams.get("map") === "true";
  const structures = await findBySearch({
    search,
    page,
    type,
    bati,
    placesAutorisees,
    departements,
    map,
    column,
    direction,
  });
  const totalStructures = await countBySearch({
    search,
    page,
    type,
    bati,
    placesAutorisees,
    departements,
  });

  return NextResponse.json({ structures, totalStructures });
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
