import { eq } from 'drizzle-orm';
import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { cities, type City, type NewCity } from '../schema';

/**
 * Get all cities
 */
export async function getAllCities(
  db: NeonHttpDatabase<any>
): Promise<City[]> {
  return await db.select().from(cities);
}

/**
 * Get city by ID
 */
export async function getCityById(
  db: NeonHttpDatabase<any>,
  id: number
): Promise<City | undefined> {
  const result = await db.select().from(cities).where(eq(cities.id, id));
  return result[0];
}

/**
 * Get city by slug
 */
export async function getCityBySlug(
  db: NeonHttpDatabase<any>,
  slug: string
): Promise<City | undefined> {
  const result = await db.select().from(cities).where(eq(cities.slug, slug));
  return result[0];
}

/**
 * Create a new city
 */
export async function createCity(
  db: NeonHttpDatabase<any>,
  data: NewCity
): Promise<City> {
  const result = await db.insert(cities).values(data).returning();
  return result[0];
}
