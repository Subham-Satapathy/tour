'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Vehicle } from '@/server/db/schema';

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
    if (!carousel || !isMobile) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const scrollWidth = carousel.scrollWidth;
      const clientWidth = carousel.clientWidth;
      
      // Calculate the index based on scroll position
      const cardWidth = (scrollWidth - clientWidth) / (vehicles.length - 1);
      const newIndex = Math.round(scrollLeft / cardWidth);
      
      // Clamp the index between 0 and vehicles.length - 1
      const clampedIndex = Math.min(Math.max(0, newIndex), vehicles.length - 1);
      setCurrentIndex(clampedIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [isMobile, vehicles.length]);

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
      const scrollLeft = index * (carouselRef.current.offsetWidth);
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
          className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black shadow-md relative z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="w-14 h-14 rounded-full bg-black text-white border-2 border-black flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black shadow-md relative z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex gap-2 mb-10 justify-center lg:justify-start">
        {vehicles.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              scrollToIndex(index);
            }}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? 'w-10 bg-black'
                : 'w-4 bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Vehicles Grid */}
      <div 
        ref={carouselRef}
        className="overflow-x-auto overflow-y-hidden sm:overflow-visible scrollbar-hide snap-x snap-mandatory sm:snap-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex gap-4 sm:gap-6 px-[7.5vw] sm:px-0">
          {vehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[340px] sm:max-w-none snap-center"
            >
              <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-black transition-all duration-300 hover:shadow-2xl group">
                {/* Vehicle Image */}
                <div className="relative h-36 sm:h-48 md:h-56 lg:h-64 bg-gray-50 overflow-hidden">
                  <img
                    src={vehicle.imageUrl || '/placeholder-vehicle.jpg'}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Vehicle Type Badge */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <span className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wide ${
                      vehicle.type === 'CAR' 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black border-2 border-black'
                    }`}>
                      {vehicle.type}
                    </span>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-xl md:text-2xl font-black text-black mb-0.5 sm:mb-1 tracking-tight leading-tight">
                    {vehicle.name}
                  </h3>
                  {(vehicle.brand || vehicle.model) && (
                    <p className="text-[10px] sm:text-sm text-gray-600 mb-2 sm:mb-4 font-medium">
                      {[vehicle.brand, vehicle.model, vehicle.year].filter(Boolean).join(' ')}
                    </p>
                  )}

                  {/* Description - Hidden on mobile */}
                  {vehicle.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 hidden md:block">
                      {vehicle.description}
                    </p>
                  )}

                  {/* Specs */}
                  <div className="flex justify-between mb-3 sm:mb-6 bg-gray-50 rounded-lg sm:rounded-xl p-1.5 sm:p-4 border border-gray-100">
                    {vehicle.mileage && (
                      <div className="flex flex-col items-center gap-0.5">
                        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-[8px] sm:text-xs text-gray-700 font-semibold text-center leading-tight">{vehicle.mileage}</span>
                      </div>
                    )}
                    {vehicle.fuelType && (
                      <div className="flex flex-col items-center gap-0.5">
                        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2v20M2 12h20" />
                        </svg>
                        <span className="text-[8px] sm:text-xs text-gray-700 font-semibold">{vehicle.fuelType}</span>
                      </div>
                    )}
                    {vehicle.transmissionType && (
                      <div className="flex flex-col items-center gap-0.5">
                        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth={2.5} />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6l4 2" />
                        </svg>
                        <span className="text-[8px] sm:text-xs text-gray-700 font-semibold">{vehicle.transmissionType}</span>
                      </div>
                    )}
                    {vehicle.seatingCapacity && (
                      <div className="flex flex-col items-center gap-0.5">
                        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-[8px] sm:text-xs text-gray-700 font-semibold">{vehicle.seatingCapacity} seats</span>
                      </div>
                    )}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-lg sm:text-2xl md:text-3xl font-black text-black tracking-tight leading-none">₹{vehicle.ratePerDay}</p>
                      <p className="text-[9px] sm:text-xs text-gray-600 font-medium">per day</p>
                    </div>
                    <button
                      disabled={!vehicle.isActive}
                      className={`px-3 py-1.5 sm:px-6 sm:py-3 rounded-full text-[11px] sm:text-base font-semibold transition-all shadow-md whitespace-nowrap ${
                        vehicle.isActive
                          ? 'bg-black text-white hover:bg-gray-800 hover:scale-105'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300'
                      }`}
                    >
                      {vehicle.isActive ? 'Book Now' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
