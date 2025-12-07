export function Stats() {
  const stats = [
    {
      number: '2,500+',
      label: 'Happy Travelers',
      description: 'Exploring Odisha with us',
      icon: '😊',
    },
    {
      number: '5+',
      label: 'Cities in Odisha',
      description: 'Comprehensive coverage across the state',
      icon: '🌍',
    },
    {
      number: '18,000+',
      label: 'Successful Trips',
      description: 'Discovering Odisha\'s heritage & beaches',
      icon: '✈️',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0xLjEwNC44OTYtMiAyLTJzMiAuODk2IDIgMi0uODk2IDItMiAyLTItLjg5Ni0yLTJtLTEyIDBjMC0xLjEwNC44OTYtMiAyLTJzMiAuODk2IDIgMi0uODk2IDItMiAyLTItLjg5Ni0yLTIiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Leading Vehicle Rentals in Odisha
          </h2>
          <p className="text-xl text-blue-100">
            Your trusted partner for exploring the state
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-6xl mb-4">{stat.icon}</div>
              <div className="text-5xl md:text-6xl font-black text-white mb-2">
                {stat.number}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {stat.label}
              </h3>
              <p className="text-blue-100">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
