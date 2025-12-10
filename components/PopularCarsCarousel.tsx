'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Vehicle } from '@/server/db/schema';
import Link from 'next/link';

interface PopularCarsCarouselProps {
  vehicles: Vehicle[];
}

export function PopularCarsCarousel({ vehicles }: PopularCarsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      // Only update pagination on mobile (when using scroll)
      if (window.innerWidth >= 640) return;
      
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = 0.85 * window.innerWidth + 16; // 85vw + 16px gap
      const spacerWidth = 0.075 * window.innerWidth; // 7.5vw
      
      // Adjust for the initial spacer
      const adjustedScrollLeft = scrollLeft - spacerWidth;
      const newIndex = Math.round(adjustedScrollLeft / cardWidth);
      
      // Clamp the index between 0 and vehicles.length - 1
      const clampedIndex = Math.min(Math.max(0, newIndex), vehicles.length - 1);
      setCurrentIndex(clampedIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [vehicles.length]);

  const visibleVehicles = 3;
  const maxIndex = Math.max(0, vehicles.length - visibleVehicles);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < vehicles.length - 1) {
      setCurrentIndex((prev) => Math.min(vehicles.length - 1, prev + 1));
    }

    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const scrollToIndex = (index: number) => {
    if (carouselRef.current && isMobile) {
      const cardWidth = 0.85 * window.innerWidth + 16; // 85vw + 16px gap
      const spacerWidth = 0.075 * window.innerWidth; // 7.5vw
      const scrollLeft = spacerWidth + (index * cardWidth);
      carouselRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10">
      {/* Navigation Buttons - Desktop Only */}
      <div className="hidden lg:flex gap-3 mb-6 relative z-20">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-14 h-14 rounded-full bg-white dark:bg-black border-2 border-gray-200 dark:border-white flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-black dark:hover:border-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-black disabled:hover:text-black dark:disabled:hover:text-white shadow-md relative z-20 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="w-14 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black dark:disabled:hover:bg-white shadow-md relative z-20 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex gap-2 mb-10 justify-center lg:justify-start">
        {vehicles.map((_, index) => {
          // On desktop, only show dots up to maxIndex (8 vehicles, 3 visible = 6 positions)
          // On mobile, show all dots (one per vehicle)
          const shouldShowDot = isMobile || index <= maxIndex;
          if (!shouldShowDot) return null;
          
          return (
            <button
              key={index}
              onClick={() => {
                const targetIndex = isMobile ? index : Math.min(index, maxIndex);
                setCurrentIndex(targetIndex);
                scrollToIndex(targetIndex);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                index === currentIndex
                  ? 'w-10 bg-black dark:bg-white'
                  : 'w-4 bg-gray-300 dark:bg-gray-700'
              }`}
            />
          );
        })}
      </div>

      {/* Vehicles Grid */}
      <div 
        ref={carouselRef}
        className="overflow-x-auto sm:overflow-hidden lg:overflow-visible scrollbar-hide snap-x snap-mandatory sm:snap-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div 
          className="flex gap-4 sm:gap-6 sm:transition-transform sm:duration-500 sm:ease-out"
          style={{
            transform: isMobile ? undefined : `translateX(-${currentIndex * (100 / 3)}%)`,
            paddingLeft: isMobile ? '7.5vw' : undefined,
          }}
        >
          {vehicles.map((vehicle, index) => (
            <Link
              key={vehicle.id}
              href={`/booking/${vehicle.id}`}
              className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[340px] sm:max-w-none snap-center block cursor-pointer h-full"
            >
              <div className="bg-white dark:bg-black rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-white hover:border-black dark:hover:border-gray-300 transition-all duration-300 hover:shadow-2xl group h-full flex flex-col">
                {/* Vehicle Image */}
                <div className="relative h-36 sm:h-48 md:h-56 lg:h-64 bg-gray-50 dark:bg-gray-900 overflow-hidden flex-shrink-0">
                  <img
                    src={vehicle.imageUrl || '/placeholder-vehicle.jpg'}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Vehicle Type Badge */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <span className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wide ${
                      vehicle.type === 'CAR' 
                        ? 'bg-black dark:bg-white text-white dark:text-black' 
                        : 'bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white'
                    }`}>
                      {vehicle.type}
                    </span>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-1">
                  <h3 className="text-base sm:text-xl md:text-2xl font-black text-black dark:text-white mb-0.5 sm:mb-1 tracking-tight leading-tight">
                    {vehicle.name}
                  </h3>
                  {(vehicle.brand || vehicle.model) && (
                    <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-4 font-medium">
                      {[vehicle.brand, vehicle.model, vehicle.year].filter(Boolean).join(' ')}
                    </p>
                  )}

                  {/* Description - Hidden on mobile, fixed height to maintain uniformity */}
                  <div className="hidden md:block h-10 mb-3 sm:mb-4">
                    {vehicle.description && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {vehicle.description}
                      </p>
                    )}
                  </div>

                  {/* Spacer to push specs and CTA to bottom */}
                  <div className="flex-1"></div>

                  {/* Specs */}
                  <div className="flex justify-between mb-3 sm:mb-6 bg-gray-50 dark:bg-gray-900 rounded-lg sm:rounded-xl p-1.5 sm:p-4 border border-gray-100 dark:border-white">
                    {vehicle.mileage && (
                      <div className="flex flex-col items-center gap-0.5">
                        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-semibold text-center leading-tight">{vehicle.mileage}</span>
                      </div>
                    )}
                    {vehicle.fuelType && (
                      <div className="flex flex-col items-center gap-0.5">
                        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2v20M2 12h20" />
                        </svg>
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-semibold">{vehicle.fuelType}</span>
                      </div>
                    )}
                    {vehicle.transmissionType && (
                      <div className="flex flex-col items-center gap-0.5">
                        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth={2.5} />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6l4 2" />
                        </svg>
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-semibold">{vehicle.transmissionType}</span>
                      </div>
                    )}
                    {vehicle.seatingCapacity && (
                      <div className="flex flex-col items-center gap-0.5">
                        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-semibold">{vehicle.seatingCapacity} seats</span>
                      </div>
                    )}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-lg sm:text-2xl md:text-3xl font-black text-black dark:text-white tracking-tight leading-none">₹{vehicle.ratePerDay}</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">per day</p>
                    </div>
                    <span
                      className={`px-3 py-1.5 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all shadow-md whitespace-nowrap inline-block ${
                        vehicle.isActive
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed border-2 border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      {vehicle.isActive ? 'Book Now' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {/* End spacer: viewport (100vw) - card width (85vw) - already have 7.5vw on left = need 7.5vw more */}
          <div className="flex-shrink-0 w-[calc(100vw-85vw-7.5vw-16px)] sm:hidden" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  );
}
