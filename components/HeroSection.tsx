'use client';

import { Car, Truck, FileText, Bike, Home as HomeIcon, ArrowRight, ArrowUp, ArrowDown, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface City {
  id: number;
  name: string;
  slug: string;
}

interface HeroSectionProps {
  cities: City[];
}

export function HeroSection({ cities }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden pt-20 pb-8 flex flex-col" style={{ colorScheme: 'light' }}>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-5 gap-2 sm:gap-4 md:gap-8 lg:gap-12 items-center pt-4 sm:pt-8 lg:pt-12">
          
          {/* Left Column - Car Image */}
          <div className="col-span-2 relative flex items-center justify-start">
            <div className="relative w-full">
              {/* Car Image - Red SUV */}
              <div className="relative w-full aspect-[4/3] bg-white flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image 
                    src="/heroCar.webp" 
                    alt="Red SUV - Triveni Tours & Travels" 
                    width={900}
                    height={700}
                    className="object-contain w-full h-full drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - All Content */}
          <div className="col-span-3 flex flex-col justify-center space-y-3 sm:space-y-4 md:space-y-6">
            <div>
              <div className="inline-block mb-2 sm:mb-3 md:mb-4">
                <div className="border-t-2 border-black w-10 sm:w-14 md:w-20 mb-1.5 md:mb-2"></div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-wide !text-gray-600">Explore Odisha Your Way!</p>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-black leading-[0.95] tracking-tighter mb-3 sm:mb-4 md:mb-6 !text-black">
                Rent Cars<br/>& Bikes<br/>In Odisha
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-3 h-3 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-black flex-shrink-0"></div>
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-xl leading-tight !text-gray-800">Premium vehicles for your Odisha adventure</p>
            </div>

            {/* Description and Buttons - Show in column on desktop */}
            <div className="hidden lg:block space-y-4 md:space-y-5">
              <p className="text-sm lg:text-base leading-relaxed max-w-2xl !text-gray-700">
                From temples to beaches, explore Odisha's stunning destinations at your own pace. Choose from our wide range of cars and bikes, available across all major cities in Odisha.
              </p>

              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link href="/vehicles" className="px-8 py-4 md:px-10 md:py-5 bg-black rounded-full font-semibold hover:scale-105 hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 shadow-lg text-base md:text-lg lg:text-xl !text-white cursor-pointer">
                  Book Now <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                </Link>
                <Link href="/vehicles" className="px-8 py-4 md:px-10 md:py-5 bg-white border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-all hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 shadow-md text-base md:text-lg lg:text-xl !text-black cursor-pointer">
                  View Vehicles <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                </Link>
              </div>
            </div>

            {/* Scroll Navigation - Right Side */}
            <div className="hidden lg:flex flex-col gap-3 fixed right-8 bottom-32 z-50">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg cursor-pointer"
              >
                <ArrowUp className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 hover:shadow-xl transition-colors shadow-lg cursor-pointer"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Description and Buttons Below - Mobile/Tablet Only */}
        <div className="lg:hidden space-y-3 sm:space-y-4 md:space-y-5 px-0 sm:px-4 md:px-8 mt-4">
          <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl !text-gray-700">
            From temples to beaches, explore Odisha's stunning destinations at your own pace. Choose from our wide range of cars and bikes, available across all major cities in Odisha.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link href="/vehicles" className="px-6 py-3 sm:px-8 sm:py-4 bg-black rounded-full font-semibold hover:scale-105 hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 shadow-lg text-sm sm:text-base md:text-lg !text-white cursor-pointer">
              Book Now <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </Link>
            <Link href="/vehicles" className="px-6 py-3 sm:px-8 sm:py-4 bg-white border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-all hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 shadow-md text-sm sm:text-base md:text-lg !text-black cursor-pointer">
              View Vehicles <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </Link>
          </div>
        </div>

        {/* Stats Section at Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-16 pt-8 lg:pt-12 pb-6">
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 leading-none !text-black">
              <span>1+ Years</span>
            </h3>
            <p className="text-sm md:text-base leading-relaxed px-4 md:px-0 !text-gray-600">Serving Odisha with reliable and affordable self-drive vehicles and family trips</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 leading-none !text-black">
              <span>25+ Vehicles</span>
            </h3>
            <p className="text-sm md:text-base leading-relaxed px-4 md:px-0 !text-gray-600">Wide range of well-maintained cars and bikes for every journey</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 leading-none !text-black">
              <span className="whitespace-nowrap">100+ Bookings</span>
            </h3>
            <p className="text-sm md:text-base leading-relaxed px-4 md:px-0 !text-gray-600">Explore temples, beaches, and heritage sites across Odisha</p>
          </div>
        </div>
      </div>
    </section>
  );
}
