import { db } from '@/server/db';
import { getPopularVehicles } from '@/server/db/queries/vehicles';
import { PopularCarsCarousel } from './PopularCarsCarousel';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export async function PopularCars() {
  const vehicles = await getPopularVehicles(db, 6);

  if (vehicles.length === 0) {
    return null;
  }

  return (
    <section id="vehicles" className="py-16 md:py-24 bg-white overflow-hidden scroll-mt-20">
      <div className="max-w-[1800px] mx-auto">
        <div className="px-4 sm:px-6 lg:px-16 flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16">
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
          <Link href="/vehicles" className="mt-6 md:mt-0 px-8 py-4 bg-black rounded-full font-semibold text-white hover:scale-105 hover:shadow-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer">
            Open Fleet
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="px-4 sm:px-6 lg:px-16">
          <PopularCarsCarousel vehicles={vehicles} />
        </div>
      </div>
    </section>
  );
}
