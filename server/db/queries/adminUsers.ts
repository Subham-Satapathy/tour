import { eq } from 'drizzle-orm';
import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { adminUsers, type AdminUser, type NewAdminUser } from '../schema';

/**
 * Get admin user by email
 */
export async function getAdminUserByEmail(
  db: NeonHttpDatabase<any>,
  email: string
): Promise<AdminUser | undefined> {
  const result = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email));
  return result[0];
}

/**
 * Get admin user by ID
 */
export async function getAdminUserById(
  db: NeonHttpDatabase<any>,
  id: number
): Promise<AdminUser | undefined> {
  const result = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, id));
  return result[0];
}

/**
 * Create a new admin user
 */
export async function createAdminUser(
  db: NeonHttpDatabase<any>,
  data: NewAdminUser
): Promise<AdminUser> {
  const result = await db.insert(adminUsers).values(data).returning();
  return result[0];
}
