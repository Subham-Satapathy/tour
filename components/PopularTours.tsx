import { db } from '@/server/db';
import { getPopularTours } from '@/server/db/queries/tours';
import { PopularToursCarousel } from './PopularToursCarousel';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export async function PopularTours() {
  const tours = await getPopularTours(db, 6);

  if (tours.length === 0) {
    return null;
  }

  return (
    <section id="tours" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950 overflow-hidden scroll-mt-20">
      <div className="max-w-[1800px] mx-auto">
        <div className="px-4 sm:px-6 lg:px-16 flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16">
          <div>
            <div className="inline-block mb-3 md:mb-4">
              <div className="border-t-2 border-black dark:border-white w-14 md:w-20 mb-2"></div>
              <p className="text-base md:text-lg lg:text-xl font-medium tracking-wide text-gray-600 dark:text-gray-400">Curated Journeys</p>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter text-black dark:text-white mb-3">
              Popular tours
            </h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md text-sm md:text-base">
              Discover handpicked tour packages with transparent pricing
            </p>
          </div>
          <Link href="/#tours" className="mt-6 md:mt-0 px-8 py-4 bg-black dark:bg-white rounded-full font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all duration-200 shadow-lg flex items-center gap-2 cursor-pointer">
            View All Tours
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="px-4 sm:px-6 lg:px-16">
          <PopularToursCarousel tours={tours} />
        </div>
      </div>
    </section>
  );
}
