'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, User, LogOut, Calendar, Moon, Sun } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Don't show admin users in the client navbar
  const isAdminUser = session?.user?.role === 'admin';
  const showSession = session && !isAdminUser;

  // Close user menu when session changes or admin is detected
  useEffect(() => {
    if (isAdminUser || !session) {
      setShowUserMenu(false);
    }
  }, [isAdminUser, session]);

  useEffect(() => {
    // Initialize dark mode from localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

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

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (pathname === '/') {
      // If on home page, scroll to section
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If on another page, navigate to home with hash
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] bg-white/95 dark:bg-black/95 backdrop-blur-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.webp" alt="Triveni Tours Logo" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <Link 
              href="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black dark:bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            <a 
              href="#vehicles"
              onClick={(e) => handleNavClick(e, 'vehicles')}
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors relative group cursor-pointer"
            >
              Vehicles
            </a>
            <a 
              href="#tours"
              onClick={(e) => handleNavClick(e, 'tours')}
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors relative group cursor-pointer"
            >
              Tours
            </a>
            <a 
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, 'how-it-works')}
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors relative group cursor-pointer"
            >
              How It Works
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleNavClick(e, 'faq')}
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors relative group cursor-pointer"
            >
              FAQ
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors relative group cursor-pointer"
            >
              Contact
            </a>
          </div>

          {/* Right Side - Dark Mode Toggle, Login & Book Now */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
            {status === 'authenticated' && showSession ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{session.user.name || session.user.email}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-white py-2">
                      <Link
                        href="/my-bookings"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        My Bookings
                      </Link>
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: '/' });
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                <Link
                  href="/vehicles"
                  className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all duration-200"
                >
                  Book Now
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="px-6 py-2.5 border border-black dark:border-white text-black dark:text-white rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                  Login
                </Link>
                <Link
                  href="/vehicles"
                  className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all duration-200"
                >
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
            <div className="flex flex-col gap-3">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-all"
              >
                Home
              </Link>
              <a 
                href="#vehicles" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, 'vehicles');
                }}
                className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-all cursor-pointer"
              >
                Vehicles
              </a>
              <a 
                href="#tours" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, 'tours');
                }}
                className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-all cursor-pointer"
              >
                Tours
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, 'how-it-works');
                }}
                className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-all cursor-pointer"
              >
                How It Works
              </a>
              <a 
                href="#faq" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, 'faq');
                }}
                className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-all cursor-pointer"
              >
                FAQ
              </a>
              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, 'contact');
                }}
                className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-all cursor-pointer"
              >
                Contact
              </a>
              <div className="pt-4 px-4 space-y-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                {status === 'authenticated' && showSession ? (
                  <>
                    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-2">
                        <User className="w-4 h-4" />
                        <span>{session.user.name || session.user.email}</span>
                      </div>
                    </div>
                    <Link
                      href="/my-bookings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-bold text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full px-6 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-lg font-bold text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                    <Link
                      href="/vehicles"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold text-center hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all duration-200"
                    >
                      Book Now
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-lg font-bold text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      href="/vehicles"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold text-center hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all duration-200"
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
