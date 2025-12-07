import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Load environment variables for scripts (Next.js loads .env.local automatically)
if (typeof window === 'undefined' && !process.env.NEXT_RUNTIME) {
  require('dotenv').config({ path: '.env.local' });
}

// Use a placeholder URL during build time if DATABASE_URL is not set
const databaseUrl = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
