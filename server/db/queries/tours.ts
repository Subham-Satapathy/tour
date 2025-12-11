import { db } from '@/server/db';
import { tours, cities } from '@/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export async function getAllTours(database: PostgresJsDatabase<any>) {
  return await database
    .select({
      id: tours.id,
      name: tours.name,
      slug: tours.slug,
      description: tours.description,
      fromCityId: tours.fromCityId,
      toCityId: tours.toCityId,
      distanceKm: tours.distanceKm,
      durationDays: tours.durationDays,
      basePrice: tours.basePrice,
      pricePerKm: tours.pricePerKm,
      highlights: tours.highlights,
      imageUrl: tours.imageUrl,
      galleryImages: tours.galleryImages,
      isActive: tours.isActive,
      isFeatured: tours.isFeatured,
      totalBookings: tours.totalBookings,
      averageRating: tours.averageRating,
      fromCity: {
        id: cities.id,
        name: cities.name,
        slug: cities.slug,
      },
    })
    .from(tours)
    .leftJoin(cities, eq(tours.fromCityId, cities.id))
    .where(eq(tours.isActive, true))
    .orderBy(desc(tours.isFeatured), desc(tours.totalBookings));
}

export async function getPopularTours(database: PostgresJsDatabase<any>, limit: number = 6) {
  return await database
    .select({
      id: tours.id,
      name: tours.name,
      slug: tours.slug,
      description: tours.description,
      fromCityId: tours.fromCityId,
      toCityId: tours.toCityId,
      distanceKm: tours.distanceKm,
      durationDays: tours.durationDays,
      basePrice: tours.basePrice,
      pricePerKm: tours.pricePerKm,
      highlights: tours.highlights,
      imageUrl: tours.imageUrl,
      galleryImages: tours.galleryImages,
      isActive: tours.isActive,
      isFeatured: tours.isFeatured,
      totalBookings: tours.totalBookings,
      averageRating: tours.averageRating,
    })
    .from(tours)
    .where(and(eq(tours.isActive, true), eq(tours.isFeatured, true)))
    .orderBy(desc(tours.totalBookings))
    .limit(limit);
}

export async function getTourBySlug(database: PostgresJsDatabase<any>, slug: string) {
  const result = await database
    .select({
      id: tours.id,
      name: tours.name,
      slug: tours.slug,
      description: tours.description,
      fromCityId: tours.fromCityId,
      toCityId: tours.toCityId,
      distanceKm: tours.distanceKm,
      durationDays: tours.durationDays,
      basePrice: tours.basePrice,
      pricePerKm: tours.pricePerKm,
      highlights: tours.highlights,
      imageUrl: tours.imageUrl,
      galleryImages: tours.galleryImages,
      isActive: tours.isActive,
      isFeatured: tours.isFeatured,
      totalBookings: tours.totalBookings,
      averageRating: tours.averageRating,
    })
    .from(tours)
    .where(and(eq(tours.slug, slug), eq(tours.isActive, true)))
    .limit(1);

  return result[0] || null;
}

export async function getTourById(database: PostgresJsDatabase<any>, id: number) {
  const result = await database
    .select({
      id: tours.id,
      name: tours.name,
      slug: tours.slug,
      description: tours.description,
      fromCityId: tours.fromCityId,
      toCityId: tours.toCityId,
      distanceKm: tours.distanceKm,
      durationDays: tours.durationDays,
      basePrice: tours.basePrice,
      pricePerKm: tours.pricePerKm,
      highlights: tours.highlights,
      imageUrl: tours.imageUrl,
      galleryImages: tours.galleryImages,
      isActive: tours.isActive,
      isFeatured: tours.isFeatured,
      totalBookings: tours.totalBookings,
      averageRating: tours.averageRating,
    })
    .from(tours)
    .where(and(eq(tours.id, id), eq(tours.isActive, true)))
    .limit(1);

  return result[0] || null;
}
