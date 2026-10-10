import * as schema from './schema';
import { createFallbackDb } from './fallback-db';

let dbInstance: any;

try {
  const path = require('path');
  const fs = require('fs');
  const dbPath = process.env.DATABASE_URL || './data/ora.db';
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const Database = require('better-sqlite3');
  const { drizzle } = require('drizzle-orm/better-sqlite3');
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  dbInstance = drizzle(sqlite, { schema });
} catch (error) {
  // Seamless fallback for Vercel Serverless / read-only filesystem
  dbInstance = createFallbackDb();
}

export const db = dbInstance;
export { schema };
