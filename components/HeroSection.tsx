'use client';

import { Car, Truck, FileText, Bike, Home as HomeIcon, ArrowRight, ArrowUp, ArrowDown, Settings } from 'lucide-react';
import Image from 'next/image';

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
    <section className="relative min-h-screen bg-white overflow-hidden pt-20 pb-8 flex flex-col">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-8 lg:pt-12">
          
          {/* Left Column - Car Image */}
          <div className="relative flex items-center justify-center lg:justify-start order-1 lg:order-1">
            <div className="relative w-full max-w-[700px]">
              {/* Car Image - Red SUV */}
              <div className="relative w-full aspect-[4/3] bg-white flex items-center justify-center overflow-visible">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image 
                    src="/heroCar.webp" 
                    alt="Red SUV - Premium Vehicle Rental" 
                    width={900}
                    height={700}
                    className="object-contain w-full h-full drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Headline & CTA */}
          <div className="flex flex-col justify-center order-2 lg:order-2 space-y-6">
            <div>
              <div className="inline-block mb-4">
                <div className="border-t-2 border-black w-16 mb-2"></div>
                <p className="text-sm text-gray-600 font-medium tracking-wide">Explore Odisha Your Way!</p>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter mb-6">
                Rent Cars<br/>& Bikes<br/>In Odisha
              </h1>
            </div>

            <div className="space-y-5 max-w-xl">
              <div className="flex items-center gap-4">
                <div className="w-7 h-7 rounded-full bg-black flex-shrink-0"></div>
                <p className="text-gray-800 font-medium text-base lg:text-lg">Premium vehicles for your Odisha adventure</p>
              </div>
              
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                From temples to beaches, explore Odisha's stunning destinations at your own pace. Choose from our wide range of cars and bikes, available across all major cities in Odisha.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button className="px-7 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all hover:scale-105 flex items-center gap-2 shadow-lg text-sm lg:text-base">
                  Book Now <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
                <button className="px-7 py-3 bg-white border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-all hover:scale-105 flex items-center gap-2 shadow-md text-sm lg:text-base">
                  View Vehicles <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            </div>

            {/* Scroll Navigation - Right Side */}
            <div className="hidden lg:flex flex-col gap-3 fixed right-8 bottom-32">
              <button className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg">
                <ArrowUp className="w-5 h-5 text-gray-700" />
              </button>
              <button className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg">
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section at Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-16 pt-8 lg:pt-12 pb-6">
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 leading-none">
              <span>1+ Years</span>
            </h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed px-4 md:px-0">Serving Odisha with reliable and affordable vehicle rental services</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 leading-none">
              <span>25+ Vehicles</span>
            </h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed px-4 md:px-0">Wide range of well-maintained cars and bikes for every journey</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 leading-none">
              <span className="whitespace-nowrap">100+ Bookings</span>
            </h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed px-4 md:px-0">Explore temples, beaches, and heritage sites across Odisha</p>
          </div>
        </div>
      </div>
    </section>
  );
}
