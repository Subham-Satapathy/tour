import { Navbar } from '@/components/Navbar';
import { BookingForm } from '@/components/BookingForm';
import { db } from '@/server/db';
import { getVehicleWithCities } from '@/server/db/queries/vehicles';
import { calculatePrice, calculateTripDuration } from '@/server/domain/pricing';
import { appConfig } from '@/config/appConfig';
import Link from 'next/link';

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

  // Validate params
  if (
    isNaN(vehicleId) ||
    !fromCityId ||
    !toCityId ||
    !startDateTime ||
    !endDateTime
  ) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Invalid Booking Request
              </h1>
              <p className="text-gray-600 mb-8">
                Missing required parameters. Please start a new search.
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

  // Fetch vehicle
  const vehicle = await getVehicleWithCities(db, vehicleId);

  if (!vehicle) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Vehicle Not Found
              </h1>
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

  // Calculate pricing
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const durationHours = calculateTripDuration(start, end);
  const pricing = calculatePrice({
    durationHours,
    ratePerHour: vehicle.ratePerHour,
    ratePerDay: vehicle.ratePerDay,
    strategy: appConfig.pricingStrategy,
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href={`/search?fromCityId=${fromCityId}&toCityId=${toCityId}&startDateTime=${startDateTime}&endDateTime=${endDateTime}`}
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              ← Back to Results
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Complete Your Booking
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Vehicle Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Trip Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-semibold text-gray-900">{vehicle.name}</p>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mt-1">
                      {vehicle.type}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Route</p>
                    <p className="font-semibold text-gray-900">
                      {vehicle.fromCity.name} → {vehicle.toCity.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Start</p>
                    <p className="font-semibold text-gray-900">
                      {start.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">End</p>
                    <p className="font-semibold text-gray-900">
                      {end.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {pricing.durationHours} hours ({pricing.durationDays} days)
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500">Pricing</p>
                    <p className="text-gray-700">
                      By hour: ₹{pricing.priceByHour}
                    </p>
                    <p className="text-gray-700">
                      By day: ₹{pricing.priceByDay}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Information
                </h2>
                <BookingForm
                  vehicleId={vehicle.id}
                  fromCityId={parseInt(fromCityId)}
                  toCityId={parseInt(toCityId)}
                  startDateTime={startDateTime}
                  endDateTime={endDateTime}
                  estimatedAmount={pricing.totalAmount}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
