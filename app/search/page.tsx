import { Navbar } from '@/components/Navbar';
import { VehicleCard } from '@/components/VehicleCard';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: Promise<{
    fromCityId?: string;
    toCityId?: string;
    startDateTime?: string;
    endDateTime?: string;
    type?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const { fromCityId, toCityId, startDateTime, endDateTime, type } = params;

  // Validate required params
  if (!fromCityId || !toCityId || !startDateTime || !endDateTime) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Invalid Search
              </h1>
              <p className="text-gray-600 mb-8">
                Please provide all required search parameters.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Fetch available vehicles
  let vehicles: any[] = [];
  let error: string | null = null;

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/search-vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromCityId: parseInt(fromCityId),
        toCityId: parseInt(toCityId),
        startDateTime,
        endDateTime,
        type: type || 'BOTH',
      }),
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      vehicles = data.vehicles || [];
    } else {
      error = 'Failed to fetch vehicles';
    }
  } catch (err) {
    error = 'An error occurred while searching for vehicles';
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg hover:gap-3 transition-all"
            >
              <span className="text-xl">←</span> Back to Search
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Available Vehicles
            </h1>
            <p className="text-gray-600 text-lg">Choose your perfect ride for the journey</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {!error && vehicles.length === 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 text-yellow-900 px-8 py-12 rounded-2xl text-center shadow-lg">
              <p className="text-3xl mb-4">🔍</p>
              <p className="text-2xl font-bold mb-2">No vehicles available</p>
              <p className="text-lg opacity-80">
                Try searching for different dates or routes.
              </p>
            </div>
          )}

          {!error && vehicles.length > 0 && (
            <>
              <p className="text-gray-600 mb-6 text-lg">
                Found <span className="font-bold text-blue-600">{vehicles.length}</span> {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    fromCityId={parseInt(fromCityId)}
                    toCityId={parseInt(toCityId)}
                    startDateTime={startDateTime}
                    endDateTime={endDateTime}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
