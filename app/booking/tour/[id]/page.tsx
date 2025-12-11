import { Navbar } from '@/components/Navbar';
import { TourBookingForm } from '@/components/TourBookingForm';
import { db } from '@/server/db';
import { tours, cities } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { MapPin, Calendar, Route as RouteIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface TourBookingPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    tourSlug?: string;
    fromCityId?: string;
    toCityId?: string;
  }>;
}

export default async function TourBookingPage({ params, searchParams }: TourBookingPageProps) {
  const { id } = await params;
  const { tourSlug, fromCityId, toCityId } = await searchParams;

  const tourId = parseInt(id);

  // Validate tour ID
  if (isNaN(tourId)) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white dark:bg-black">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
              Invalid Tour
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The tour you're looking for doesn't exist.
            </p>
            <Link
              href="/"
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all duration-200"
            >
              Browse Tours
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Fetch tour details
  const tourResult = await db
    .select()
    .from(tours)
    .where(eq(tours.id, tourId))
    .limit(1);

  const tour = tourResult[0];

  if (!tour) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white dark:bg-black">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
              Tour Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The tour you're looking for doesn't exist or is no longer available.
            </p>
            <Link
              href="/"
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all duration-200"
            >
              Browse Tours
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Fetch city details
  const [fromCity, toCity] = await Promise.all([
    db.select().from(cities).where(eq(cities.id, tour.fromCityId)).limit(1),
    db.select().from(cities).where(eq(cities.id, tour.toCityId)).limit(1),
  ]);

  const totalPrice = tour.basePrice + (tour.distanceKm * tour.pricePerKm);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tour Details */}
            <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-white rounded-xl overflow-hidden">
              <div className="h-64 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                {tour.imageUrl ? (
                  <img
                    src={tour.imageUrl}
                    alt={tour.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-300 text-6xl">🗺️</div>
                )}
              </div>
              
              <div className="p-6">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                  {tour.name}
                </h1>
                
                {fromCity[0] && toCity[0] && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">
                      {fromCity[0].name} → {toCity[0].name}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                      <RouteIcon className="w-4 h-4" />
                      <span className="text-sm font-semibold">Distance</span>
                    </div>
                    <p className="text-xl font-black text-gray-900 dark:text-white">
                      {tour.distanceKm} km
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-semibold">Duration</span>
                    </div>
                    <p className="text-xl font-black text-gray-900 dark:text-white">
                      {tour.durationDays} {tour.durationDays === 1 ? 'Day' : 'Days'}
                    </p>
                  </div>
                </div>

                {tour.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      About This Tour
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tour.description}
                    </p>
                  </div>
                )}

                {tour.highlights && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Tour Highlights
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(tour.highlights).map((highlight: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-white">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Pricing Details
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Base Price</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ₹{tour.basePrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Per km Rate</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ₹{tour.pricePerKm}/km
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Distance Charge</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ₹{(tour.distanceKm * tour.pricePerKm).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t-2 border-gray-300 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Total Price
                      </span>
                      <span className="text-3xl font-black text-gray-900 dark:text-white">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <TourBookingForm tour={tour} fromCity={fromCity[0]} toCity={toCity[0]} />
          </div>
        </div>
      </main>
    </>
  );
}
