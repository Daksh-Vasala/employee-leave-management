import dotenv from "dotenv";
dotenv.config();

const port = Number(process.env.PORT || 3000);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DB_URL is missing in environment variables");
}

export const env = {
  PORT: port,
  DATABASE_URL: databaseUrl,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};
