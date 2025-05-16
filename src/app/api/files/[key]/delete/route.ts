import { NextRequest, NextResponse } from "next/server";
import { deleteOneByKey, findOneByKey } from "../../file.repository";
import { deleteFile } from "../../file.service";

export async function DELETE(request: NextRequest) {
  const pathSegments = request.nextUrl.pathname.split("/");
  const encodedKey = pathSegments[pathSegments.length - 2];

  if (!encodedKey) {
    return NextResponse.json({ error: "Key not provided" }, { status: 400 });
  }

  const key = decodeURIComponent(encodedKey);
  const file = await findOneByKey(key);
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    await deleteFile(process.env.S3_BUCKET_NAME!, file.key);
    const deletedFile = await deleteOneByKey(key);
    return NextResponse.json(deletedFile);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du fichier" },
      { status: 500 }
    );
  }
}
