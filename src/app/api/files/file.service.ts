import { Client } from "minio";

const minioClient = new Client({
  endPoint: process.env.S3_URL!,
  accessKey: process.env.S3_ACCESS!,
  secretKey: process.env.S3_SECRET!,
  useSSL: true,
});

export async function uploadFile(
  bucketName: string,
  fileName: string,
  fileBuffer: Buffer
): Promise<string> {
  try {
    await minioClient.putObject(bucketName, fileName, fileBuffer);
    return `Fichier ${fileName} uploadé avec succès dans le bucket ${bucketName}`;
  } catch (error) {
    console.error(`Erreur lors de l'upload du fichier ${fileName} :`, error);
    throw new Error("Erreur lors de l'upload du fichier sur OVH S3");
  }
}
