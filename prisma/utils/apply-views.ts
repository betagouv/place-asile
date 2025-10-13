import fs from "fs";
import { execSync } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const viewFiles = fs.readdirSync("./prisma/views");
console.log("Creating views...");
for (const file of viewFiles) {
  console.log(`➡️ Applying ${file}`);
  execSync(`psql ${process.env.DATABASE_URL} -f prisma/views/${file}`, {
    stdio: "inherit",
  });
}
console.log("Views created successfully");