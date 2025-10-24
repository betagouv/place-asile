import { execSync } from "child_process";

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("❌ Merci de préciser le nom du script à exécuter.");
    console.error("👉 Exemple : yarn one-off migrate-forms-prod");
    process.exit(1);
}

const scriptName = args[0];
const scriptPath = `prisma/one-off-scripts/${scriptName}.ts`;

console.log(`🚀 Exécution du script one-off : ${scriptPath}`);

try {
    execSync(`npx tsx ${scriptPath}`, { stdio: "inherit" });
} catch (err) {
    console.error(`❌ Erreur lors de l'exécution du script ${scriptName}`, err);
    process.exit(1);
}
