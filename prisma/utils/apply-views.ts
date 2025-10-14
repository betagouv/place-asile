import { execSync } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const viewFiles = fs.readdirSync("./prisma/views");
console.log("Creating views...");
console.log("DATABASE_URL", process.env.DATABASE_URL);

// Get db URL
const dbUrl = process.env.DATABASE_URL || "";
const psqlUrl = (() => {
  try {
    const u = new URL(dbUrl);
    u.search = ""; // to drop everything after a "?"
    return u.toString();
  } catch {
    return dbUrl;
  }
})();

// Drop and recreate reporting schema
const schema = process.env.REPORTING_SCHEMA || "reporting";
try {
  execSync(
    `psql "${psqlUrl}" -v ON_ERROR_STOP=1 ` +
      `-c "DROP SCHEMA IF EXISTS \\"${schema}\\" CASCADE;" ` +
      `-c "CREATE SCHEMA \\"${schema}\\";"`,
    { stdio: "inherit" }
  );
  console.log(`✅ Schema "${schema}" recreated`);
} catch (error: any) {
  console.error(`❌ Failed to recreate schema "${schema}"`);
  if (typeof error?.status !== "undefined") console.error(`Exit code: ${error.status}`);
  if (error?.stderr) console.error(String(error.stderr));
  process.exit(1);
}

// Apply views
for (const file of viewFiles) {
  console.log(`➡️ Applying ${file}`);
  try {
    execSync(`psql "${psqlUrl}" -v ON_ERROR_STOP=1 -v SCHEMA="${schema}" -f prisma/views/${file}`, {
      stdio: "inherit",
    });
    console.log(`✅ Applied ${file}`);
  } catch (error: any) {
    console.error(`❌ Failed to apply ${file}`);
    if (error && typeof error.status !== "undefined") console.error(`Exit code: ${error.status}`);
    if (error && error.stderr) console.error(String(error.stderr));
    process.exit(1);
  }
}

console.log("Views created successfully");