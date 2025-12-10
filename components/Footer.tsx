'use client';

import Link from 'next/link';

export function Footer() {
  const footerLinks = {
    Services: [
      { name: 'Self Drive Cars', href: '/search?type=car' },
      { name: 'Self Drive Bikes', href: '/search?type=bike' },
      { name: 'Family Trips', href: '/search?type=trip' },
      { name: 'Tour Packages', href: '/search' }
    ],
    Company: [
      { name: 'About Us', href: '#about' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Contact', href: '#contact' },
      { name: 'FAQ', href: '#faq' }
    ],
    Destinations: [
      { name: 'Bhubaneswar', href: '/search?city=bhubaneswar' },
      { name: 'Puri', href: '/search?city=puri' },
      { name: 'Konark', href: '/search?city=konark' },
      { name: 'Cuttack', href: '/search?city=cuttack' }
    ],
  };

  return (
    <footer id="contact" className="bg-white dark:bg-black scroll-mt-20 py-8 sm:py-10 lg:py-12">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Rounded Container */}
        <div className="bg-white dark:bg-black rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-white px-6 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 lg:py-12 xl:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 mb-8 sm:mb-10 lg:mb-12">
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="mb-5 sm:mb-6 block flex items-center">
                <img src="/logo.png" alt="Triveni Tours Logo" className="h-10 sm:h-12 w-auto" />
              </Link>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-xs">
                Triveni Tours empowers you to explore Odisha with self-drive cars, bikes and family trips — making travel easier to plan, enjoy, and remember.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a href="https://twitter.com/trivenitours" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/trivenitours" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://facebook.com/trivenitours" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-gray-900 dark:text-white font-bold text-xs sm:text-sm mb-4 sm:mb-5">{title}</h3>
                <ul className="space-y-2 sm:space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href} 
                        onClick={(e) => {
                          if (link.href.startsWith('#')) {
                            e.preventDefault();
                            document.getElementById(link.href.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs sm:text-sm cursor-pointer block break-words"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-6 sm:my-8"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © 2025 Triveni Tours & Travels. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-center">
              <a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors underline">Privacy Policy</a>
              <a href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors underline">Terms of Service</a>
              <a href="/cancellation" className="text-gray-600 hover:text-gray-900 transition-colors underline">Cancellation Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
