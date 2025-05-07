"use server";

import { NextResponse } from "next/server";
import { uploadFile } from "./file.service";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { error: "Aucun fichier fourni" },
      { status: 400 }
    );
  }
  console.log("Fichier reçu :", file.name, file.size, file.type);

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const result = await uploadFile(
    process.env.S3_BUCKET_NAME!,
    file.name,
    fileBuffer
  );

  return NextResponse.json({ message: result });
}
