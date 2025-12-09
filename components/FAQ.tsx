'use client';

import { useState } from 'react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI payments, and net banking. Payment is secure and processed through encrypted channels.',
    },
    {
      question: 'How do I modify or cancel my booking?',
      answer: 'You can modify or cancel your booking through your account dashboard up to 24 hours before your scheduled pickup time. Cancellation charges may apply based on the timing.',
    },
    {
      question: 'What documents do I need to rent a vehicle?',
      answer: 'You need a valid driving license, government-issued ID proof (Aadhar/Passport), and a credit/debit card for the security deposit.',
    },
    {
      question: 'Is insurance included in the rental price?',
      answer: 'Yes, basic insurance is included in all our rental packages. Additional comprehensive coverage is available at an extra cost.',
    },
    {
      question: 'Can I extend my rental period?',
      answer: 'Yes, you can extend your rental period subject to vehicle availability. Contact our support team or extend directly through the app.',
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
            FAQ
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4">
            <div className="hidden sm:block h-0.5 w-12 bg-gray-300"></div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 text-center">
              Frequently asked questions answered
            </p>
            <div className="hidden sm:block h-0.5 w-12 bg-gray-300"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 sm:border-[3px] border-gray-900 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 pr-3 sm:pr-4">
                  {faq.question}
                </span>
                <span className="text-2xl sm:text-3xl font-black flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center transition-transform duration-300" style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 bg-gray-50 border-t-2 sm:border-t-[3px] border-gray-900">
                  <p className="text-gray-700 leading-relaxed font-medium text-xs sm:text-sm lg:text-base">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16 lg:mt-20">
          <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
            Still have questions?
          </p>
          <button className="px-8 py-3 sm:px-10 sm:py-4 lg:py-5 bg-black text-white rounded-full font-bold text-sm sm:text-base lg:text-lg hover:scale-105 hover:shadow-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform cursor-pointer">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
