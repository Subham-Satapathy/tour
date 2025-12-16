import { eq } from 'drizzle-orm';
import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { users, type User } from '../schema';

/**
 * Get user by email
 */
export async function getUserByEmail(
  db: NeonHttpDatabase<any>,
  email: string
): Promise<User | undefined> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return user;
}

/**
 * Get admin user by email (verified admin role and active status)
 */
export async function getAdminByEmail(
  db: NeonHttpDatabase<any>,
  email: string
): Promise<User | undefined> {
  const user = await getUserByEmail(db, email);
  
  if (!user || user.role !== 'admin' || !user.isActive) {
    return undefined;
  }
  
  return user;
}
