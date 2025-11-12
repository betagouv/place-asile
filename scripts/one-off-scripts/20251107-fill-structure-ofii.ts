// Fill StructureOfii table with csv from s3 bucket
import { PrismaClient, StructureType } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { Client } from "minio";

const prisma = new PrismaClient();
const OFII_BUCKET_NAME = process.env.DOCS_BUCKET_NAME!;
const OFII_CSV_FILENAME = process.env.OFII_CSV_FILENAME!;

const minioClient = new Client(
    {
        endPoint: process.env.S3_URL!,
        accessKey: process.env.S3_ACCESS!,
        secretKey: process.env.S3_SECRET!,
        useSSL: true,
    }
);

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

        console.log("Résolution des IDs des opérateurs...");
        const operateurs = await prisma.operateur.findMany({
            select: { id: true, name: true }
        });
        const operateurMap = new Map(operateurs.map(op => [op.name, op.id]));

        // create missing opérateurs
        const operateursInCsv = [...new Set(
            records
                .map((r: any) => r.operateur_nom)
                .filter((nom): nom is string => !!nom)
        )];

        const missingOperateurs = operateursInCsv.filter(nom => !operateurMap.has(nom));

        if (missingOperateurs.length > 0) {
            console.log(`Création de ${missingOperateurs.length} opérateurs manquants...`);
            for (const nom of missingOperateurs) {
                const newOperateur = await prisma.operateur.create({
                    data: { name: nom }
                });
                operateurMap.set(nom, newOperateur.id);
                console.log(`-> Opérateur créé: ${nom}`);
            }
        }

        console.log("Résolution des IDs des départements...");
        const departements = await prisma.departement.findMany({
            select: { numero: true }
        });
        const departementSet = new Set(departements.map(dep => dep.numero));

        // Validation des données
        console.log("Validation des données...");
        const validRecords = [];
        const errors = [];

        for (const row of records as any[]) {
            const issues = [];

            if (!row.departement || !departementSet.has(row.departement)) {
                issues.push(`département invalide: ${row.departement}`);
            }

            if (issues.length > 0) {
                errors.push({ dnaCode: row.dnaCode, issues });
            } else {
                validRecords.push(row);
            }
        }

        if (errors.length > 0) {
            console.log(`⚠️ ${errors.length} lignes avec erreurs :`);
            errors.slice(0, 10).forEach(err => {
                console.log(`  - ${err.dnaCode}: ${err.issues.join(', ')}`);
            });
            if (errors.length > 10) {
                console.log(`  ... et ${errors.length - 10} autres erreurs`);
            }
        }

        if (validRecords.length === 0) {
            console.log("❌ Aucune donnée valide à insérer");
            return;
        }

        console.log(`✓ ${validRecords.length} lignes valides sur ${records.length}`);

        console.log("Suppression des données existantes...");
        await prisma.structureOfii.deleteMany();

        console.log("Insertion dans la base de données...");
        const result = await prisma.structureOfii.createMany({
            data: validRecords.map((row: any) => ({
                dnaCode: row.dnaCode,
                nom: row.nom,
                type: row.type as StructureType,
                operateurId: row.operateur_nom ? operateurMap.get(row.operateur_nom) : null,
                departementNumero: row.departement,
                directionTerritoriale: row.direction_territoriale,
                nomOfii: row.nom_ofii,
            })),
            skipDuplicates: true,
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