'use client';

import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Stay updated with Triveni Tours
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium px-4">
              Subscribe to get exclusive deals and travel tips from Triveni Tours & Travels
            </p>
          </div>

          {/* Subscribe Form */}
          <form className="w-full px-4 sm:px-6 md:max-w-4xl md:mx-auto">
            <div className="relative flex items-center bg-white p-2 sm:p-3 rounded-full border-[3px] border-gray-900 shadow-xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 sm:px-8 py-2.5 sm:py-4 rounded-full text-gray-900 bg-transparent border-none focus:outline-none text-sm sm:text-lg font-medium placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="subscribe-button relative px-6 sm:px-20 rounded-full font-bold text-base sm:text-2xl text-white cursor-pointer overflow-hidden border-none flex items-center justify-center flex-shrink-0"
                style={{ height: '52px', minHeight: '52px', minWidth: '120px', zIndex: 1 }}
              >
                <span className="subscribe-text absolute left-0 top-0 w-full h-full flex items-center justify-center rounded-full border-none z-10"
                  style={{
                    background: 'linear-gradient(rgba(255, 255, 255, 0.473), rgba(150, 150, 255, 0.25))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}>
                  Subscribe
                </span>
                <span className="blob blob-1" />
                <span className="blob blob-2" />
                <span className="blob blob-3" />
                <span className="blob blob-4" />
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center font-medium">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>

      <style jsx>{`
        .blob {
          position: absolute;
          z-index: -1;
          border-radius: 80px;
          transition: transform 0.3s ease-in-out, background 0.3s ease-in-out;
        }
        
        @media (max-width: 640px) {
          .blob {
            width: 80px;
            height: 50px;
          }
          .blob-1 {
            left: -5px;
            top: -3px;
            background: #ff930f;
          }
          .blob-2 {
            left: 30px;
            top: -3px;
            background: #bf0fff;
          }
          .blob-3 {
            left: 60px;
            top: -8px;
            background: #ff1b6b;
          }
          .blob-4 {
            left: 70px;
            top: 5px;
            background: #0061ff;
          }
        }
        
        @media (min-width: 641px) {
          .blob {
            width: 190px;
            height: 130px;
            border-radius: 150px;
          }
          .blob-1 {
            left: -30px;
            top: -32px;
            background: #ff930f;
          }
          .blob-2 {
            left: 80px;
            top: -32px;
            background: #bf0fff;
          }
          .blob-3 {
            left: 185px;
            top: -37px;
            background: #ff1b6b;
          }
          .blob-4 {
            left: 215px;
            top: 22px;
            background: #0061ff;
          }
        }
        
        .subscribe-button:hover .blob-1 {
          background: #0061ff;
          transform: scale(1.3);
        }
        .subscribe-button:hover .blob-2 {
          background: #ff1b6b;
          transform: scale(1.3);
        }
        .subscribe-button:hover .blob-3 {
          background: #bf0fff;
          transform: scale(1.3);
        }
        .subscribe-button:hover .blob-4 {
          background: #ff930f;
          transform: scale(1.3);
        }
        .subscribe-button:active {
          border: 2px solid white;
        }
      `}</style>
    </section>
  );
}
