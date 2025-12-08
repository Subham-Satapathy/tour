'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Triveni Tours */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🚗</span>
            <span className="text-2xl font-black">Triveni Tours</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-black font-medium transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            <Link 
              href="/search" 
              className="text-gray-700 hover:text-black font-medium transition-colors relative group cursor-pointer"
            >
              Self Drive
            </Link>
            <a 
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-700 hover:text-black font-medium transition-colors relative group cursor-pointer"
            >
              How It Works
            </a>
            <a 
              href="#faq" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-700 hover:text-black font-medium transition-colors relative group cursor-pointer"
            >
              FAQ
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-700 hover:text-black font-medium transition-colors relative group cursor-pointer"
            >
              Contact
            </a>
          </div>

          {/* Right Side - Search & Book Now */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/search" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </Link>
            <Link href="/search" className="px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 w-full bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-full bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-full bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fadeIn">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all"
              >
                🏠 Home
              </Link>
              <Link 
                href="/search" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all"
              >
                🚗 Self Drive
              </Link>
              <a 
                href="#how-it-works" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all cursor-pointer"
              >
                ℹ️ How It Works
              </a>
              <a 
                href="#faq" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all cursor-pointer"
              >
                ❓ FAQ
              </a>
              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all cursor-pointer"
              >
                📞 Contact
              </a>
              <Link 
                href="/search" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="mx-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-center hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all"
              >
                📅 Book Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
