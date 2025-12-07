export function Testimonials() {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Bhubaneswar',
      rating: 5,
      comment: 'Amazing service! Rented a car for my Puri temple visit. The booking process was smooth and the vehicle was in perfect condition. Highly recommended for exploring Odisha!',
      avatar: '👨‍💼',
    },
    {
      name: 'Priya Sharma',
      location: 'Cuttack',
      rating: 5,
      comment: 'Best car rental experience ever! Explored Konark and Chilika Lake comfortably. Professional service, clean vehicles, and transparent pricing. Perfect for Odisha tours!',
      avatar: '👩‍💼',
    },
    {
      name: 'Amit Patel',
      location: 'Rourkela',
      rating: 5,
      comment: 'Excellent bikes for my coastal Odisha trip. Rode from Bhubaneswar to Puri beach. The staff was helpful and the entire process was hassle-free. Great value!',
      avatar: '👨‍🦱',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real stories
          </h2>
          <p className="text-xl text-gray-600">
            See what our customers say about us
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
