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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Stay updated with Triveni Tours
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-medium">
              Subscribe to get exclusive deals and travel tips from Triveni Tours and Travels
            </p>
          </div>

          {/* Subscribe Form */}
          <form className="max-w-4xl mx-auto">
            <div className="relative flex items-center bg-white p-2.5 rounded-full border-[3px] border-gray-900 shadow-xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-8 py-3.5 rounded-full text-gray-900 bg-transparent border-none focus:outline-none text-lg font-medium placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="subscribe-button relative px-12 rounded-full font-bold text-2xl text-white cursor-pointer overflow-hidden border-none flex items-center justify-center"
                style={{ minWidth: '200px', height: '56px', zIndex: 1 }}
              >
                <span className="subscribe-text absolute left-0 top-0 w-full h-full flex items-center justify-center rounded-full border-none z-10"
                  style={{
                    background: 'linear-gradient(rgba(255, 255, 255, 0.473), rgba(150, 150, 255, 0.25))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}>
                  Subscribe
                </span>
                <span className="blob blob-1" style={{
                  position: 'absolute',
                  zIndex: -1,
                  borderRadius: '5em',
                  width: '6em',
                  height: '4em',
                  left: '-0.5em',
                  top: '0',
                  background: '#ff930f',
                  transition: 'transform 0.3s ease-in-out, background 0.3s ease-in-out'
                }} />
                <span className="blob blob-2" style={{
                  position: 'absolute',
                  zIndex: -1,
                  borderRadius: '5em',
                  width: '6em',
                  height: '4em',
                  left: '2.5em',
                  top: '0',
                  background: '#bf0fff',
                  transition: 'transform 0.3s ease-in-out, background 0.3s ease-in-out'
                }} />
                <span className="blob blob-3" style={{
                  position: 'absolute',
                  zIndex: -1,
                  borderRadius: '5em',
                  width: '6em',
                  height: '4em',
                  left: '5.5em',
                  top: '-0.5em',
                  background: '#ff1b6b',
                  transition: 'transform 0.3s ease-in-out, background 0.3s ease-in-out'
                }} />
                <span className="blob blob-4" style={{
                  position: 'absolute',
                  zIndex: -1,
                  borderRadius: '5em',
                  width: '6em',
                  height: '4em',
                  left: '6.5em',
                  top: '1em',
                  background: '#0061ff',
                  transition: 'transform 0.3s ease-in-out, background 0.3s ease-in-out'
                }} />
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center font-medium">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>

      <style jsx>{`
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
