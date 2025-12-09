'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, User, LogOut, Calendar } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Triveni Tours Logo" className="h-12 w-auto" />
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
            <a 
              href="#vehicles"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('vehicles')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-700 hover:text-black font-medium transition-colors relative group cursor-pointer"
            >
              Vehicles
            </a>
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

          {/* Right Side - Login & Book Now */}
          <div className="hidden md:flex items-center gap-4">
            {status === 'authenticated' && session?.user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium text-gray-900">{session.user.name || session.user.email}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <Link
                        href="/my-bookings"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        My Bookings
                      </Link>
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: '/' });
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                <Link
                  href="/vehicles"
                  className="px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300"
                >
                  Book Now
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="px-6 py-2.5 border border-black text-black rounded-full font-medium hover:bg-gray-50 transition-all duration-300">
                  Login
                </Link>
                <Link
                  href="/vehicles"
                  className="px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300"
                >
                  Book Now
                </Link>
              </>
            )}
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
          <div className="md:hidden py-6 border-t border-gray-200 animate-fadeIn">
            <div className="flex flex-col gap-3">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:text-black font-semibold transition-all"
              >
                Home
              </Link>
              <a 
                href="#vehicles" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.getElementById('vehicles')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-3 text-gray-700 hover:text-black font-semibold transition-all cursor-pointer"
              >
                Vehicles
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-3 text-gray-700 hover:text-black font-semibold transition-all cursor-pointer"
              >
                How It Works
              </a>
              <a 
                href="#faq" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-3 text-gray-700 hover:text-black font-semibold transition-all cursor-pointer"
              >
                FAQ
              </a>
              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-3 text-gray-700 hover:text-black font-semibold transition-all cursor-pointer"
              >
                Contact
              </a>
              <div className="pt-4 px-4 space-y-3 border-t border-gray-200 mt-2">
                {status === 'authenticated' && session?.user ? (
                  <>
                    <div className="px-4 py-3 bg-gray-100 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-900 font-semibold mb-2">
                        <User className="w-4 h-4" />
                        <span>{session.user.name || session.user.email}</span>
                      </div>
                    </div>
                    <Link
                      href="/my-bookings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-bold text-center hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full px-6 py-3 border-2 border-black text-black rounded-lg font-bold text-center hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                    <Link
                      href="/vehicles"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 bg-black text-white rounded-lg font-bold text-center hover:bg-gray-800 transition-all"
                    >
                      Book Now
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 border-2 border-black text-black rounded-lg font-bold text-center hover:bg-gray-50 transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      href="/vehicles"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 bg-black text-white rounded-lg font-bold text-center hover:bg-gray-800 transition-all"
                    >
                      Book Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
