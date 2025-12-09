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
    <section id="faq" className="py-24 bg-gradient-to-b from-white to-gray-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            FAQ
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-0.5 w-12 bg-gray-300"></div>
            <p className="text-lg text-gray-600">
              Frequently asked questions answered
            </p>
            <div className="h-0.5 w-12 bg-gray-300"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-[3px] border-gray-900 rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="font-bold text-lg md:text-xl text-gray-900 pr-4">
                  {faq.question}
                </span>
                <span className="text-3xl font-black flex-shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center transition-transform duration-300" style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-8 py-6 bg-gray-50 border-t-[3px] border-gray-900">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <p className="text-xl font-bold text-gray-900 mb-6">
            Still have questions?
          </p>
          <button className="px-10 py-5 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
