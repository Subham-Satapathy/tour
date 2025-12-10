import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      title: 'No Delays',
      description: 'Experience seamless pickups and drop-offs. Our vehicles are always ready on time, ensuring your travel plans stay on track throughout Odisha.',
    },
    {
      title: 'High Quality',
      description: 'All our vehicles undergo rigorous maintenance checks. Travel in comfort and safety with our premium fleet of well-maintained cars and bikes.',
    },
    {
      title: 'Premium Support',
      description: '24/7 customer assistance at your service. Whether you need roadside help or booking support, our team is always ready to assist you.',
    },
    {
      title: 'Diverse Selection',
      description: 'From compact cars to SUVs and bikes, choose from our extensive fleet. Find the perfect vehicle for your temple tours, beach trips, or city exploration.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-black">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 lg:mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white">
            Why choose us
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start mb-12 sm:mb-16 lg:mb-24">
          {/* Left - Car Image */}
          <div className="relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/wheel.png"
                alt="Premium Vehicle"
                width={600}
                height={450}
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* Right - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-black border-2 border-gray-100 dark:border-white p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-300"
              >
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="relative mt-20 sm:mt-32 lg:mt-48">
          {/* Car Image - Positioned to overflow above */}
          <div className="relative lg:absolute lg:left-0 lg:top-0 lg:bottom-0 lg:w-1/2 z-10 h-[250px] sm:h-[300px] lg:h-auto flex items-end lg:items-center justify-center lg:-translate-y-32">
            <Image
              src="/featuresJeep.svg"
              alt="Luxury Car"
              width={700}
              height={450}
              className="object-contain w-full h-full max-h-[500px] dark:invert"
            />
          </div>

          {/* Background Box */}
          <div className="bg-white dark:bg-black border-4 border-gray-900 dark:border-white rounded-3xl overflow-hidden pt-6 sm:pt-8 lg:pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
              {/* Left - Stats Area */}
              <div className="relative h-full flex items-end px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-12 lg:pt-12">
                <div className="flex flex-wrap gap-3 sm:gap-4 z-20">
                  <div className="bg-gray-50 dark:bg-black border-2 border-gray-200 dark:border-white rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-4">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">24/7</p>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">Customer Support</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-black border-2 border-gray-200 dark:border-white rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-4">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">100%</p>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">Verified Vehicles</p>
                  </div>
                </div>
              </div>

            {/* Right - Call to Action */}
            <div className="p-6 sm:p-8 lg:p-16">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6 leading-tight break-words">
                Save money with Triveni Tours
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 lg:mb-10 text-xs sm:text-sm lg:text-base">
                Best prices in Odisha with full refund in case of cancellation
              </p>
              <Link href="/vehicles" className="px-6 py-2.5 sm:px-7 sm:py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-lg text-xs sm:text-sm lg:text-base cursor-pointer inline-flex">
                Book Now <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
