// Fill StructureOfii table with csv from s3 bucket
import { PrismaClient, StructureType } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { Client } from "minio";

const prisma = new PrismaClient();

const OFII_BUCKET_NAME = process.env.OFII_BUCKET_NAME!;
const OFII_CSV_FILENAME = process.env.OFII_CSV_FILENAME!;

const minioClient = new Client({
    endPoint: process.env.S3_URL!,
    accessKey: process.env.S3_ACCESS!,
    secretKey: process.env.S3_SECRET!,
    useSSL: true,
});

const checkBucket = async (bucketName: string) => {
    const exists = await minioClient.bucketExists(bucketName);
    if (exists) {
        console.log("Bucket " + bucketName + " exists.");
    } else {
        await minioClient.makeBucket(bucketName);
        console.log("Bucket " + bucketName + " created.");
    }
};

// open csv and load data into StructureOfii table
const loadDataToOfiiTable = async () => {
    try {
        console.log("Vérification du bucket...");
        await checkBucket(OFII_BUCKET_NAME);

        console.log("Récupération du fichier CSV...");
        const stream = await minioClient.getObject(OFII_BUCKET_NAME, OFII_CSV_FILENAME);

        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const csvContent = Buffer.concat(chunks).toString('utf-8');

        console.log("Parsing du CSV...");
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        console.log(`${records.length} lignes trouvées`);

        if (records.length === 0) {
            console.log("⚠️ Aucune donnée à insérer");
            return;
        }

        console.log("Suppression des données existantes...");
        await prisma.structureOfii.deleteMany();

        console.log("Insertion dans la base de données...");
         
        const result = await prisma.structureOfii.createMany({
            data: records.map((row: any) => ({
                dnaCode: row.dnaCode,
                nom: row.nom,
                type: row.type as StructureType,
                operateur: row.operateur,
                departement: row.departement,
                directionTerritoriale: row.directionTerritoriale,
                nomOfii: row.nomOfii,
            })),
            skipDuplicates: true, // Évite les erreurs si les données existent déjà
        });

        console.log(`✅ ${result.count} structures insérées avec succès`);
    } catch (error) {
        console.error("❌ Erreur lors du chargement des données:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};

loadDataToOfiiTable();