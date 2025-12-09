'use client';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            How It's Works
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4">
            <div className="hidden sm:block h-0.5 w-12 bg-gray-300"></div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 text-center">
              Self-drive cars, bikes and family trips with vehicle & driver
            </p>
            <div className="hidden sm:block h-0.5 w-12 bg-gray-300"></div>
          </div>
        </div>

        {/* 3D Cards Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Choose Your Location Card */}
            <div style={{ perspective: '1000px', padding: '10px' }}>
              <div className="card-3d group relative pt-10 sm:pt-12 border-[3px] border-gray-900 shadow-[rgba(142,142,142,0.3)_0px_30px_30px_-10px] transition-all duration-500 ease-in-out bg-gray-900 h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  background: 'linear-gradient(135deg, transparent 18.75%, #f3f3f3 0 31.25%, transparent 0), repeating-linear-gradient(45deg, #f3f3f3 -6.25% 6.25%, #141414 0 18.75%)',
                  backgroundSize: '60px 60px',
                  backgroundPosition: '0 0, 0 0',
                  backgroundColor: '#141414',
                  minHeight: '380px'
                }}>
                
                {/* Number Badge */}
                <div className="absolute top-6 sm:top-8 right-6 sm:right-8 h-12 w-12 sm:h-16 sm:w-16 bg-gray-900 border border-blue-500 p-1.5 sm:p-2 shadow-[rgba(100,100,111,0.2)_0px_17px_10px_-10px]"
                  style={{ transform: 'translate3d(0px, 0px, 80px)' }}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-blue-500 text-[10px] sm:text-xs font-bold">STEP</span>
                    <span className="text-blue-500 text-xl sm:text-2xl font-black">1</span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="bg-blue-500 p-5 sm:p-6 lg:p-8 transition-all duration-500 ease-in-out h-full flex flex-col"
                  style={{ transformStyle: 'preserve-3d' }}>
                  <div className="mb-4 sm:mb-6" style={{ transform: 'translate3d(0px, 0px, 50px)' }}>
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-900 transition-transform duration-500 group-hover:translate-z-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  
                  <h3 className="inline-block text-gray-900 text-lg sm:text-xl font-black mb-2 sm:mb-3 transition-all duration-500"
                    style={{ transform: 'translate3d(0px, 0px, 50px)' }}>
                    Choose Your Location
                  </h3>
                  
                  <p className="text-gray-900 text-xs sm:text-sm font-bold leading-relaxed transition-all duration-500"
                    style={{ transform: 'translate3d(0px, 0px, 30px)' }}>
                    Select your preferred location effortlessly with Triveni Tours & Travels' user-friendly interface for seamless self-drive experiences
                  </p>
                </div>
              </div>
            </div>

            {/* Pick-Up Date Card */}
            <div style={{ perspective: '1000px', padding: '10px' }}>
              <div className="card-3d group relative pt-10 sm:pt-12 border-[3px] border-gray-900 shadow-[rgba(142,142,142,0.3)_0px_30px_30px_-10px] transition-all duration-500 ease-in-out bg-gray-900 h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  background: 'linear-gradient(135deg, transparent 18.75%, #f3f3f3 0 31.25%, transparent 0), repeating-linear-gradient(45deg, #f3f3f3 -6.25% 6.25%, #141414 0 18.75%)',
                  backgroundSize: '60px 60px',
                  backgroundPosition: '0 0, 0 0',
                  backgroundColor: '#141414',
                  minHeight: '380px'
                }}>
                
                {/* Number Badge */}
                <div className="absolute top-6 sm:top-8 right-6 sm:right-8 h-12 w-12 sm:h-16 sm:w-16 bg-gray-900 border border-purple-500 p-1.5 sm:p-2 shadow-[rgba(100,100,111,0.2)_0px_17px_10px_-10px]"
                  style={{ transform: 'translate3d(0px, 0px, 80px)' }}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-purple-500 text-[10px] sm:text-xs font-bold">STEP</span>
                    <span className="text-purple-500 text-xl sm:text-2xl font-black">2</span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="bg-purple-500 p-5 sm:p-6 lg:p-8 transition-all duration-500 ease-in-out h-full flex flex-col"
                  style={{ transformStyle: 'preserve-3d' }}>
                  <div className="mb-4 sm:mb-6" style={{ transform: 'translate3d(0px, 0px, 50px)' }}>
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-900 transition-transform duration-500 group-hover:translate-z-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  
                  <h3 className="inline-block text-gray-900 text-lg sm:text-xl font-black mb-2 sm:mb-3 transition-all duration-500"
                    style={{ transform: 'translate3d(0px, 0px, 50px)' }}>
                    Pick - Up Date
                  </h3>
                  
                  <p className="text-gray-900 text-xs sm:text-sm font-bold leading-relaxed transition-all duration-500"
                    style={{ transform: 'translate3d(0px, 0px, 30px)' }}>
                    Choose your preferred pick-up date effortlessly and start your journey on time with Triveni Tours & Travels
                  </p>
                </div>
              </div>
            </div>

            {/* Book Your Car Card */}
            <div style={{ perspective: '1000px', padding: '10px' }}>
              <div className="card-3d group relative pt-10 sm:pt-12 border-[3px] border-gray-900 shadow-[rgba(142,142,142,0.3)_0px_30px_30px_-10px] transition-all duration-500 ease-in-out bg-gray-900 h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  background: 'linear-gradient(135deg, transparent 18.75%, #f3f3f3 0 31.25%, transparent 0), repeating-linear-gradient(45deg, #f3f3f3 -6.25% 6.25%, #141414 0 18.75%)',
                  backgroundSize: '60px 60px',
                  backgroundPosition: '0 0, 0 0',
                  backgroundColor: '#141414',
                  minHeight: '380px'
                }}>
                
                {/* Number Badge */}
                <div className="absolute top-6 sm:top-8 right-6 sm:right-8 h-12 w-12 sm:h-16 sm:w-16 bg-gray-900 border border-green-500 p-1.5 sm:p-2 shadow-[rgba(100,100,111,0.2)_0px_17px_10px_-10px]"
                  style={{ transform: 'translate3d(0px, 0px, 80px)' }}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-green-500 text-[10px] sm:text-xs font-bold">STEP</span>
                    <span className="text-green-500 text-xl sm:text-2xl font-black">3</span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="bg-green-500 p-5 sm:p-6 lg:p-8 transition-all duration-500 ease-in-out h-full flex flex-col"
                  style={{ transformStyle: 'preserve-3d' }}>
                  <div className="mb-4 sm:mb-6" style={{ transform: 'translate3d(0px, 0px, 50px)' }}>
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-900 transition-transform duration-500 group-hover:translate-z-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                      <rect x="7" y="9" width="10" height="8" rx="1" />
                      <circle cx="7" cy="17" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>
                  
                  <h3 className="inline-block text-gray-900 text-lg sm:text-xl font-black mb-2 sm:mb-3 transition-all duration-500"
                    style={{ transform: 'translate3d(0px, 0px, 50px)' }}>
                    Book Your Vehicle or Trip
                  </h3>
                  
                  <p className="text-gray-900 text-xs sm:text-sm font-bold leading-relaxed transition-all duration-500"
                    style={{ transform: 'translate3d(0px, 0px, 30px)' }}>
                    Book self-drive cars, bikes or family trips with vehicle and driver. Perfect for comfortable family travel experiences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .card-3d:hover {
            transform: rotate3d(0.5, 1, 0, 30deg);
            background-position: -100px 100px, -100px 100px !important;
          }
        `}</style>
      </div>
    </section>
  );
}
