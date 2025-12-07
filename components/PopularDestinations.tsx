'use client';

import Link from 'next/link';

interface City {
  id: number;
  name: string;
  slug: string;
}

interface PopularDestinationsProps {
  cities: City[];
}

export function PopularDestinations({ cities }: PopularDestinationsProps) {
  const destinations = [
    { name: 'Bhubaneswar to Puri', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', price: '₹1,200' },
    { name: 'Bhubaneswar to Konark', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', price: '₹1,500' },
    { name: 'Cuttack to Puri', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', price: '₹1,800' },
    { name: 'Rourkela to Bhubaneswar', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', price: '₹3,500' },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Popular Routes in Odisha
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From ancient temples to pristine beaches - discover Odisha's treasures
          </p>
        </div>

        {/* Quick Search Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {cities.slice(0, 5).map((city) => (
            <button
              key={city.id}
              className="px-6 py-3 bg-white border-2 border-gray-200 rounded-full font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg transition-all duration-300"
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Popular Routes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{dest.name}</h3>
                <p className="text-2xl font-extrabold text-blue-400">{dest.price}</p>
                <p className="text-sm text-gray-300 mt-1">Starting price per day</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
