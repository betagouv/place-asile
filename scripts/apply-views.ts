import { execSync } from "child_process";
import fs from "fs";
import path from "path";


const scriptsPath = path.join(__dirname, "views");
const viewFiles = fs.readdirSync(scriptsPath);
console.log("Creating views...");

const databaseUrl = process.env.DATABASE_URL || "";
console.log("DATABASE_URL", databaseUrl);

const psqlUrl = getDbUrl(databaseUrl);

// Drop and recreate reporting schema
const schema = process.env.REPORTING_SCHEMA || "reporting";

runPsqlOrExit(
  `psql "${psqlUrl}" -v ON_ERROR_STOP=1 ` +
    `-c "DROP SCHEMA IF EXISTS \"${schema}\" CASCADE;" ` +
    `-c "CREATE SCHEMA \"${schema}\";"`,
  `✅ Schema "${schema}" recreated`,
  `❌ Failed to recreate schema "${schema}"`
);

for (const file of viewFiles) {
  console.log(`➡️ Applying ${file}`);
  runPsqlOrExit(
    `psql "${psqlUrl}" -v ON_ERROR_STOP=1 -v SCHEMA="${schema}" -f ${scriptsPath}/${file}`,
    `✅ Applied ${file}`,
    `❌ Failed to apply ${file}`
  );
}

console.log("Views created successfully");

// Utils

function getDbUrl(rawDatabaseUrl: string): string {
  try {
    const parsedUrl = new URL(rawDatabaseUrl);
    parsedUrl.search = ""; // to drop everything after a "?"
    return parsedUrl.toString();
  } catch {
    return rawDatabaseUrl;
  }
}

function runPsqlOrExit(command: string, successMsg?: string, failureMsg?: string): void {
  try {
    execSync(command, { stdio: "inherit" });
    if (successMsg) console.log(successMsg);
  } catch (error: unknown) {
    if (failureMsg) console.error(failureMsg);
    if (typeof error === "object" && error && "status" in error) {
      console.error(`Exit code: ${(error as { status?: number }).status}`);
    }
    if (typeof error === "object" && error && "stderr" in error) {
      const stderr = (error as { stderr?: unknown }).stderr;
      if (stderr) console.error(String(stderr));
    }
    process.exit(1);
  }
}