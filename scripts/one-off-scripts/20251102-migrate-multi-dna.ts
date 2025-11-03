import { CodeDnaType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function migrateMultiDna() {
    console.log("🚀 Début de la migration des Codes DNA...");

    const structures = await prisma.structure.findMany();
    console.log(`📊 ${structures.length} structures trouvées`);

    for (const structure of structures) {
        console.log(`🔍 Traitement de la structure ${structure.dnaCode}...`);

        await prisma.codeDna.upsert({
            where: { code: structure.dnaCode },
            update: { structureId: structure.id },
            create: {
                code: structure.dnaCode,
                structureId: structure.id,
                creationDate: structure.creationDate,
                adresseAdministrative: structure.adresseAdministrative,
                codePostalAdministratif: structure.codePostalAdministratif,
                communeAdministrative: structure.communeAdministrative,
                departementAdministratif: structure.departementAdministratif,
                latitude: structure.latitude,
                longitude: structure.longitude,
                type: CodeDnaType.PRINCIPAL,
            }
        });
    }

    console.log("✅ Migration terminée");
}

migrateMultiDna();