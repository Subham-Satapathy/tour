import Link from 'next/link';
import { MapPin, Calendar, Route } from 'lucide-react';

interface Tour {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  fromCityId: number;
  toCityId: number;
  distanceKm: number;
  durationDays: number;
  basePrice: number;
  pricePerKm: number;
  highlights: string | null;
  imageUrl: string | null;
  galleryImages: string | null;
  isActive: boolean;
  isFeatured: boolean;
  totalBookings: number;
  averageRating: string | null;
}

interface TourCardProps {
  tour: Tour;
  fromCityName?: string;
  toCityName?: string;
}

export function TourCard({
  tour,
  fromCityName,
  toCityName,
}: TourCardProps) {
  const totalPrice = tour.basePrice + (tour.distanceKm * tour.pricePerKm);
  
  // Create booking URL with tour details
  const bookingUrl = `/booking/tour/${tour.id}?tourSlug=${tour.slug}&fromCityId=${tour.fromCityId}&toCityId=${tour.toCityId}`;

  return (
    <div className="group relative bg-white dark:bg-black border-2 border-gray-200 dark:border-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-black dark:hover:border-gray-300 flex flex-col h-full min-h-[600px]">
      <div className="relative">
        <div className="h-56 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
          {tour.imageUrl ? (
            <img
              src={tour.imageUrl}
              alt={tour.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-gray-300 text-6xl group-hover:scale-110 transition-transform duration-300">
              🗺️
            </div>
          )}
        </div>
        {tour.isFeatured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
            FEATURED
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-gray-200 transition-colors">
            {tour.name}
          </h3>
          {fromCityName && toCityName && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{fromCityName} → {toCityName}</span>
            </div>
          )}
        </div>

        {/* Tour Details */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
            <Route className="w-3 h-3" />
            <span>{tour.distanceKm} km</span>
          </div>
          <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
            <Calendar className="w-3 h-3" />
            <span>{tour.durationDays} {tour.durationDays === 1 ? 'Day' : 'Days'}</span>
          </div>
          {tour.averageRating && (
            <span className="text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
              ⭐ {parseFloat(tour.averageRating).toFixed(1)}
            </span>
          )}
        </div>

        {/* Description with fixed height to maintain uniform card size */}
        <div className="h-10 mb-4">
          {tour.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {tour.description}
            </p>
          )}
        </div>

        {/* Highlights */}
        {tour.highlights && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Highlights</p>
            <div className="flex flex-wrap gap-1">
              {JSON.parse(tour.highlights).slice(0, 3).map((highlight: string, index: number) => (
                <span key={index} className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Spacer to push pricing and button to bottom */}
        <div className="flex-1"></div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-white mb-4">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">Trip Price</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">₹{totalPrice.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Base Price</p>
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300">₹{tour.basePrice.toLocaleString()}</p>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Per km rate</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">₹{tour.pricePerKm}/km</p>
            </div>
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
