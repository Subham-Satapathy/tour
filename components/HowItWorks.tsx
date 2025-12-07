export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Choose your destination',
      description: 'Select your pickup and drop-off locations from our wide network of cities',
      icon: '📍',
    },
    {
      number: '2',
      title: 'Pick your dates',
      description: 'Choose your travel dates and browse available vehicles',
      icon: '📅',
    },
    {
      number: '3',
      title: 'Book instantly',
      description: 'Complete your booking with instant confirmation',
      icon: '⚡',
    },
    {
      number: '4',
      title: 'Hit the road',
      description: 'Pick up your vehicle and start your journey',
      icon: '🚗',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ready to travel?
          </h2>
          <p className="text-xl text-gray-600">
            Get on the road in just 4 easy steps
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
                )}
                
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-4xl">{step.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-600">
                      {step.number}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
}
