import Link from 'next/link';

interface Vehicle {
  id: number;
  name: string;
  type: 'CAR' | 'BIKE';
  brand?: string | null;
  model?: string | null;
  seatingCapacity?: number | null;
  fuelType?: string | null;
  transmissionType?: string | null;
  ratePerHour: number;
  ratePerDay: number;
  description: string | null;
  imageUrl: string | null;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  fromCityId?: number;
  toCityId?: number;
  startDateTime?: string;
  endDateTime?: string;
}

export function VehicleCard({
  vehicle,
  fromCityId,
  toCityId,
  startDateTime,
  endDateTime,
}: VehicleCardProps) {
  const hasBookingParams = fromCityId && toCityId && startDateTime && endDateTime;
  
  const bookingUrl = hasBookingParams
    ? `/booking/${vehicle.id}?${new URLSearchParams({
        fromCityId: fromCityId.toString(),
        toCityId: toCityId.toString(),
        startDateTime,
        endDateTime,
      }).toString()}`
    : `/booking/${vehicle.id}`;

  return (
    <div className="group relative bg-white dark:bg-black border-2 border-gray-200 dark:border-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-black dark:hover:border-gray-300 flex flex-col h-full min-h-[600px]">
      <div className="relative">
        <div className="h-56 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-gray-300 text-6xl group-hover:scale-110 transition-transform duration-300">
              {vehicle.type === 'CAR' ? '🚗' : '🏍️'}
            </div>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-gray-200 transition-colors">
              {vehicle.name}
            </h3>
            {vehicle.brand && vehicle.model && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {vehicle.brand} {vehicle.model}
              </p>
            )}
          </div>
          <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full ml-2 flex-shrink-0">
            {vehicle.type}
          </span>
        </div>

        {/* Vehicle Details */}
        {(vehicle.seatingCapacity || vehicle.fuelType || vehicle.transmissionType) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {vehicle.seatingCapacity && (
              <span className="text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                {vehicle.seatingCapacity} Seats
              </span>
            )}
            {vehicle.fuelType && (
              <span className="text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-2 py-1 rounded capitalize">
                {vehicle.fuelType.toLowerCase()}
              </span>
            )}
            {vehicle.transmissionType && (
              <span className="text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-2 py-1 rounded capitalize">
                {vehicle.transmissionType.toLowerCase()}
              </span>
            )}
          </div>
        )}

        {/* Description with fixed height to maintain uniform card size */}
        <div className="h-10 mb-4">
          {vehicle.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {vehicle.description}
            </p>
          )}
        </div>
        
        {/* Spacer to push pricing and button to bottom */}
        <div className="flex-1"></div>
        
        <div className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-white">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">Per Hour</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">₹{vehicle.ratePerHour}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">Per Day</p>
            <p className="text-xl font-black text-gray-900 dark:text-white">₹{vehicle.ratePerDay}</p>
          </div>
        </div>
        
        <Link
          href={bookingUrl}
          className="block w-full bg-black dark:bg-white text-white dark:text-black text-center py-3 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all duration-200"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
