import { Pool } from "pg";

const globalForDb = globalThis;

const pool =
  globalForDb.digitalRsPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.digitalRsPool = pool;
}

export default pool;