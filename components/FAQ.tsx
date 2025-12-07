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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            FAQ
          </h2>
          <p className="text-xl text-gray-600">
            Frequently asked questions answered
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 transition-colors duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg text-gray-900 pr-4">
                  {faq.question}
                </span>
                <span className="text-2xl text-blue-600 flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-4">
            Still have questions?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
