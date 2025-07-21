import dotenv from "dotenv";
dotenv.config();

export const databaseUrl = process.env.DATABASE_URL;
export const port = process.env.PORT || 3000;



