import { defineConfig } from "prisma/config";
import fs from "fs";
import path from "path";

// Manually parse the .env file to ensure DATABASE_URL is available
const envPath = path.resolve(process.cwd(), ".env");
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const match = envContent.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
  if (match) {
    databaseUrl = match[1];
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: "npx tsx ./prisma/seed.ts",
  },
});
