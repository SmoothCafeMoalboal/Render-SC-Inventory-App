import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@shared/schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

console.log('Connecting to Supabase/Postgres database...');
const client = postgres(databaseUrl!);
export const db = drizzle(client, { schema });
