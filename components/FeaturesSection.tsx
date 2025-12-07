export function FeaturesSection() {
  const features = [
    {
      icon: '🔍',
      title: 'Easy Search',
      description: 'Find the perfect vehicle for your journey in seconds',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '✅',
      title: 'Quick Booking',
      description: 'Seamless booking process with instant confirmation',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: '🚗',
      title: 'Hit the Road',
      description: 'Start your adventure with our reliable vehicles',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Three reasons to choose us
          </h2>
          <p className="text-xl text-gray-600">
            Experience hassle-free travel across beautiful Odisha
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
