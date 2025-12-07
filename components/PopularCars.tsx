import { db } from '@/server/db';
import { getPopularVehicles } from '@/server/db/queries/vehicles';
import { PopularCarsCarousel } from './PopularCarsCarousel';
import { ArrowRight } from 'lucide-react';

export async function PopularCars() {
  const vehicles = await getPopularVehicles(db, 6);

  if (vehicles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16">
          <div>
            <div className="inline-block mb-3 md:mb-4">
              <div className="border-t-2 border-black w-14 md:w-20 mb-2"></div>
              <p className="text-base md:text-lg lg:text-xl font-medium tracking-wide text-gray-600">Premium Fleet</p>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter text-black mb-3">
              Popular vehicles
            </h2>
            <p className="text-gray-700 max-w-md text-sm md:text-base">
              Explore our premium fleet of cars and bikes for your perfect journey
            </p>
          </div>
          <button className="mt-6 md:mt-0 px-8 py-4 bg-black rounded-full font-semibold text-white hover:bg-gray-800 transition-all hover:scale-105 shadow-lg flex items-center gap-2">
            Open Fleet
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <PopularCarsCarousel vehicles={vehicles} />
      </div>
    </section>
  );
}
