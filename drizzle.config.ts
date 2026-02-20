import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({
  path: ".env.local",
});

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // The '!' tells TypeScript you're sure this exists
    url: process.env.DATABASE_URL!, 
  },
} satisfies Config;