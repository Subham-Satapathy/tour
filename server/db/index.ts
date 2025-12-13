import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Load environment variables for scripts (Next.js loads .env.local automatically)
if (typeof window === 'undefined' && !process.env.NEXT_RUNTIME) {
  require('dotenv').config({ path: '.env.local' });
}

let _db: ReturnType<typeof drizzle> | null = null;

function getDatabase() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const sql = neon(process.env.DATABASE_URL, {
      fetchConnectionCache: true,
    });
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDatabase()[prop as keyof ReturnType<typeof drizzle>];
  }
});
