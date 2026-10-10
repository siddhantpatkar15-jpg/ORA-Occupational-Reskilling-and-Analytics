import { db } from './index';
import { sql } from 'drizzle-orm';
// This will run the Drizzle migrations
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

async function runMigrations() {
  console.log('Running migrations...');
  migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations complete.');
}

runMigrations().catch(console.error);
