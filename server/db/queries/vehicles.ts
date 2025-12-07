import { eq, and, sql } from 'drizzle-orm';
import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { vehicles, cities, type Vehicle, type NewVehicle } from '../schema';

export interface VehicleWithCities extends Vehicle {
  fromCity: { id: number; name: string; slug: string };
  toCity: { id: number; name: string; slug: string };
}

/**
 * Get all vehicles
 */
export async function getAllVehicles(
  db: NeonHttpDatabase<any>
): Promise<Vehicle[]> {
  return await db.select().from(vehicles);
}

/**
 * Get popular vehicles (active vehicles, limited to 6)
 */
export async function getPopularVehicles(
  db: NeonHttpDatabase<any>,
  limit: number = 6
): Promise<Vehicle[]> {
  return await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.isActive, true))
    .limit(limit);
}

/**
 * Get vehicle by ID
 */
export async function getVehicleById(
  db: NeonHttpDatabase<any>,
  id: number
): Promise<Vehicle | undefined> {
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id));
  return result[0];
}

/**
 * Get vehicle by ID with city details
 */
export async function getVehicleWithCities(
  db: NeonHttpDatabase<any>,
  id: number
): Promise<VehicleWithCities | undefined> {
  const result = await db
    .select({
      id: vehicles.id,
      name: vehicles.name,
      type: vehicles.type,
      fromCityId: vehicles.fromCityId,
      toCityId: vehicles.toCityId,
      ratePerHour: vehicles.ratePerHour,
      ratePerDay: vehicles.ratePerDay,
      description: vehicles.description,
      imageUrl: vehicles.imageUrl,
      isActive: vehicles.isActive,
      createdAt: vehicles.createdAt,
      updatedAt: vehicles.updatedAt,
      fromCity: {
        id: cities.id,
        name: cities.name,
        slug: cities.slug,
      },
      toCity: {
        id: sql<number>`to_city.id`,
        name: sql<string>`to_city.name`,
        slug: sql<string>`to_city.slug`,
      },
    })
    .from(vehicles)
    .innerJoin(cities, eq(vehicles.fromCityId, cities.id))
    .innerJoin(
      sql`${cities} as to_city`,
      sql`${vehicles.toCityId} = to_city.id`
    )
    .where(eq(vehicles.id, id));

  return result[0] as VehicleWithCities | undefined;
}

/**
 * Get vehicles by route and type
 */
export async function getVehiclesByRoute(
  db: NeonHttpDatabase<any>,
  fromCityId: number,
  toCityId: number,
  type?: 'CAR' | 'BIKE'
): Promise<Vehicle[]> {
  const conditions = [
    eq(vehicles.fromCityId, fromCityId),
    eq(vehicles.toCityId, toCityId),
    eq(vehicles.isActive, true),
  ];

  if (type) {
    conditions.push(eq(vehicles.type, type));
  }

  return await db
    .select()
    .from(vehicles)
    .where(and(...conditions));
}

/**
 * Create a new vehicle
 */
export async function createVehicle(
  db: NeonHttpDatabase<any>,
  data: NewVehicle
): Promise<Vehicle> {
  const result = await db.insert(vehicles).values(data).returning();
  return result[0];
}

/**
 * Update a vehicle
 */
export async function updateVehicle(
  db: NeonHttpDatabase<any>,
  id: number,
  data: Partial<NewVehicle>
): Promise<Vehicle | undefined> {
  const result = await db
    .update(vehicles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(vehicles.id, id))
    .returning();
  return result[0];
}

/**
 * Delete a vehicle
 */
export async function deleteVehicle(
  db: NeonHttpDatabase<any>,
  id: number
): Promise<void> {
  await db.delete(vehicles).where(eq(vehicles.id, id));
}
