import { execSync } from "child_process";

const arg = process.argv[2];
if (!arg) {
    console.error("❌ Erreur : tu dois fournir le nom du script, ex : yarn migrate 20251020-migrate-forms-and-steps");
    process.exit(1);
}

const cmd = `yarn install --production=false && npx prisma generate && npx tsx prisma/one-off-scripts/${arg}.ts`;

console.log(`🚀 Exécution de : ${cmd}\n`);
execSync(cmd, { stdio: "inherit" });
