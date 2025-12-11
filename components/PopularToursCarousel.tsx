'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TourCard } from './TourCard';

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

interface PopularToursCarouselProps {
  tours: Tour[];
}

export function PopularToursCarousel({ tours }: PopularToursCarouselProps) {
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
      
      // Clamp the index between 0 and tours.length - 1
      const clampedIndex = Math.min(Math.max(0, newIndex), tours.length - 1);
      setCurrentIndex(clampedIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [tours.length]);

  const visibleTours = 3;
  const maxIndex = Math.max(0, tours.length - visibleTours);

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

    if (isLeftSwipe && currentIndex < tours.length - 1) {
      setCurrentIndex((prev) => Math.min(tours.length - 1, prev + 1));
    }

    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const scrollToCard = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // For mobile (scroll-based navigation)
    if (window.innerWidth < 640) {
      const cardWidth = 0.85 * window.innerWidth + 16; // 85vw + 16px gap
      const spacerWidth = 0.075 * window.innerWidth; // 7.5vw
      const scrollPosition = spacerWidth + (index * cardWidth);
      carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
    
    setCurrentIndex(index);
  };

  if (tours.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Desktop Navigation Buttons */}
      {!isMobile && tours.length > visibleTours && (
        <>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-14 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
            }`}
            aria-label="Previous tours"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-14 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center ${
              currentIndex >= maxIndex ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
            }`}
            aria-label="Next tours"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      {/* Carousel Container - Mobile: Horizontal scroll, Desktop: CSS transform */}
      <div
        ref={carouselRef}
        className="sm:overflow-visible overflow-x-auto scrollbar-hide scroll-smooth"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile: Flex with scroll, Desktop: Grid with transform */}
        <div className="sm:hidden flex gap-4">
          {/* Left spacer for mobile */}
          <div className="flex-shrink-0 w-[7.5vw]"></div>
          {tours.map((tour) => (
            <div key={tour.id} className="flex-shrink-0 w-[85vw]">
              <TourCard tour={tour} />
            </div>
          ))}
          {/* Right spacer for mobile */}
          <div className="flex-shrink-0 w-[7.5vw]"></div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:block overflow-hidden">
          <div
            className="grid grid-cols-3 gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)`,
            }}
          >
            {tours.map((tour) => (
              <div key={tour.id} className="min-w-0">
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      {tours.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {tours.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-black dark:bg-white'
                  : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
              }`}
              aria-label={`Go to tour ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
