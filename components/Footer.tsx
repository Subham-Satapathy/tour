import Link from 'next/link';

export function Footer() {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
    Resources: ['Documentation', 'Tutorials', 'Blog', 'Support'],
    Company: ['About', 'Careers', 'Contact', 'Partners'],
  };

  return (
    <footer id="contact" className="bg-gray-50 scroll-mt-20 py-12">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Rounded Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 lg:px-16 py-12 lg:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link href="/" className="text-2xl font-black text-gray-900 mb-6 block flex items-center gap-2">
                🚗 Triveni Tours
              </Link>
              <p className="text-sm leading-relaxed text-gray-600 mb-8 max-w-xs">
                Triveni Tours empowers you to explore Odisha with self-drive cars, bikes and family trips — making travel easier to plan, enjoy, and remember.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-gray-900 font-bold text-sm mb-5">{title}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 Triveni Tours and Travels. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors underline">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors underline">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors underline">Cookies Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
