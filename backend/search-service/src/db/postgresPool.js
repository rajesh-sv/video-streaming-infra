import { Pool } from "pg";
import { PG_URI } from "../config/config.js";
import { logger } from "../utils/pinoLogger.js";

const pool = new Pool({
  connectionString: PG_URI,
});

pool.on("error", (error) => {
  logger.error(error.message);
});

export function query(queryObj) {
  return pool.query(queryObj);
}

export function endConnection() {
  pool.end();
}
