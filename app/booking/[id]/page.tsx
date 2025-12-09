import { Navbar } from '@/components/Navbar';
import { BookingFormComponent } from '@/components/BookingFormComponent';
import { db } from '@/server/db';
import { vehicles, cities } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface BookingPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    fromCityId?: string;
    toCityId?: string;
    startDateTime?: string;
    endDateTime?: string;
  }>;
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { id } = await params;
  const { fromCityId, toCityId, startDateTime, endDateTime } = await searchParams;

  const vehicleId = parseInt(id);

  // Validate vehicle ID
  if (isNaN(vehicleId)) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-4">
              Invalid Vehicle
            </h1>
            <p className="text-gray-600 mb-8">
              The vehicle you're looking for doesn't exist.
            </p>
            <Link
              href="/vehicles"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 active:scale-95 transition-all duration-200"
            >
              Browse Vehicles
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Fetch vehicle
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, vehicleId))
    .limit(1);

  if (!vehicle) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-4">
              Vehicle Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              This vehicle is no longer available.
            </p>
            <Link
              href="/vehicles"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 active:scale-95 transition-all duration-200"
            >
              Browse Other Vehicles
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Fetch all cities
  const allCities = await db.select().from(cities);

  // Prepare initial data if provided
  const initialData = {
    fromCityId: fromCityId ? parseInt(fromCityId) : undefined,
    toCityId: toCityId ? parseInt(toCityId) : undefined,
    startDateTime,
    endDateTime,
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <BookingFormComponent 
          vehicle={vehicle} 
          cities={allCities}
          initialData={initialData}
        />
      </main>
    </>
  );
}
