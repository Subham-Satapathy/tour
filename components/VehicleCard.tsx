import Link from 'next/link';

interface Vehicle {
  id: number;
  name: string;
  type: 'CAR' | 'BIKE';
  ratePerHour: number;
  ratePerDay: number;
  description: string | null;
  imageUrl: string | null;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  fromCityId: number;
  toCityId: number;
  startDateTime: string;
  endDateTime: string;
}

export function VehicleCard({
  vehicle,
  fromCityId,
  toCityId,
  startDateTime,
  endDateTime,
}: VehicleCardProps) {
  const params = new URLSearchParams({
    fromCityId: fromCityId.toString(),
    toCityId: toCityId.toString(),
    startDateTime,
    endDateTime,
  });

  return (
    <div className="group relative bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
        <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="text-gray-300 text-6xl group-hover:scale-110 transition-transform duration-300">
              {vehicle.type === 'CAR' ? '🚗' : '🏍️'}
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{vehicle.name}</h3>
          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-md">
            {vehicle.type}
          </span>
        </div>
        {vehicle.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {vehicle.description}
          </p>
        )}
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Rate per Hour</p>
            <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">₹{vehicle.ratePerHour}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Rate per Day</p>
            <p className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹{vehicle.ratePerDay}</p>
          </div>
        </div>
        <Link
          href={`/booking/${vehicle.id}?${params.toString()}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3.5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          🚀 Select & Book
        </Link>
      </div>
    </div>
  );
}
